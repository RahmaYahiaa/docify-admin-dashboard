import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  CheckCircle,
  X,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import RejectModal from "./components/RejectModal";
import {
  useDoctor,
  useApproveDoctor,
  useRejectDoctor,
} from "@/hooks/useDoctors";

export default function DoctorVerificationDetailsPage() {
  const [localStatus, setLocalStatus] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data: rawDoctor, isLoading, isError } = useDoctor(id);

  const doctor = rawDoctor
    ? {
        id: rawDoctor["basic info"]?.id,
        name: rawDoctor["basic info"]?.name || "",
        phone: rawDoctor["basic info"]?.phone || "",
        specialty: rawDoctor["basic info"]?.specialty || "",
        profile_picture: rawDoctor["basic info"]?.profile_picture || null,
        email: rawDoctor.email || "",
        address: rawDoctor.address || "",
        status: rawDoctor.status || "pending",
        about: rawDoctor.about || "",
        yearsOfExperience:
          rawDoctor.professional_details?.experience_years ?? null,
        submissionDate: rawDoctor.submission_info?.submitted_at || "",
        certificates: rawDoctor.uploaded_certificate
          ? [rawDoctor.uploaded_certificate]
          : [],
        verificationChecklist: rawDoctor.verification_checklist || {},
      }
    : null;

  const [checklistState, setChecklistState] = useState([]);

  useEffect(() => {
    if (doctor?.verificationChecklist) {
      setChecklistState([
        {
          key: "medical_certificate_uploaded",
          label: "Medical certificate uploaded",
          valid: !!doctor.verificationChecklist.medical_certificate_uploaded,
        },
        {
          key: "doctor_profile_information_completed",
          label: "Doctor profile information completed",
          valid:
            !!doctor.verificationChecklist.doctor_profile_information_completed,
        },
        {
          key: "phone_number_provided",
          label: "Phone number provided",
          valid: !!doctor.verificationChecklist.phone_number_provided,
        },
        {
          key: "email_address_verified",
          label: "Email address verified",
          valid: !!doctor.verificationChecklist.email_address_verified,
        },
      ]);
    }
  }, [rawDoctor]);

  const approveMutation = useApproveDoctor();
  const rejectMutation = useRejectDoctor();
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-slate-400">Loading...</span>
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-slate-400">Doctor not found</span>
      </div>
    );
  }

  const currentStatus = (localStatus ?? doctor.status ?? "")
    .toLowerCase()
    .trim();
  const isPending = currentStatus === "pending";
  const isRejected = currentStatus === "rejected";
  const isApproved = currentStatus === "approved";

  const handleApprove = () => {
    approveMutation.mutate(id, {
      onSuccess: () => {
        setLocalStatus("approved");
        queryClient.invalidateQueries(["doctor", id]);
      },
    });
  };

  const handleReject = (finalReason) => {
    rejectMutation.mutate(
      { id, reason: finalReason },
      {
        onSuccess: () => {
          setLocalStatus("rejected");
          queryClient.invalidateQueries(["doctor", id]);
          setShowRejectModal(false);
        },
      },
    );
  };

  const failedItems = checklistState
    .filter((item) => !item.valid)
    .map((item) => item.label);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/doctor-verification")}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Doctor Verification
            </h1>
            <p className="text-sm text-slate-500">Review application details</p>
          </div>
        </div>

        {/* Action Buttons */}
        {isPending && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <X size={16} />
              Reject
            </button>

            <button
              onClick={handleApprove}
              disabled={approveMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <CheckCircle size={16} />
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </button>
          </div>
        )}

        {isRejected && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleApprove}
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Re-evaluate
            </button>
          </div>
        )}

        {isApproved && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                rejectMutation.mutate(
                  { id, reason: "revoked" },
                  {
                    onSuccess: () => {
                      setLocalStatus("rejected");
                      queryClient.invalidateQueries(["doctor", id]);
                    },
                  },
                );
              }}
              className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
            >
              Revoke approval
            </button>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Doctor Info (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Doctor Information
            </h2>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                {doctor.profile_picture ? (
                  <img
                    src={doctor.profile_picture}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-slate-600">
                    {doctor.name?.charAt(0)?.toUpperCase() || "D"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{doctor.name}</p>
                <p className="text-sm text-slate-500">
                  {doctor.specialty || ""}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="break-all">{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span>{doctor.address}</span>
              </div>
            </div>

            {/* About */}
            {doctor.about && (
              <div className="mt-6 pt-5 border-t border-[#E5E5E5]">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                  About
                </p>
                <p className="text-sm text-slate-600 leading-6">
                  {doctor.about}
                </p>
              </div>
            )}
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Professional Details
            </h2>
            <div className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-lg">
              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Years of Experience
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {doctor.yearsOfExperience ?? 0} years
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <CheckCircle size={18} className="text-[#0066CC]" />
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Uploaded Certificates
            </h2>
            <div className="space-y-3">
              {doctor.certificates.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-[#E5E5E5] rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-red-500">
                        IMG
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {cert.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Uploaded Document
                      </p>
                    </div>
                  </div>
                  <a
                    href={cert.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  >
                    <Download size={16} className="text-slate-500" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Submission Info & Checklist */}
        <div className="space-y-6">
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Submission Info
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Submitted on</p>
                  <p className="font-medium text-slate-900">
                    {doctor.submissionDate}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Current Status</p>
                <StatusBadge status={currentStatus} />
              </div>
            </div>
          </div>

          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[10px] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Verification Checklist
            </h2>
            <div className="space-y-2.5">
              {checklistState.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle
                    size={14}
                    className={
                      item.valid
                        ? "text-green-500 mt-0.5"
                        : "text-slate-300 mt-0.5"
                    }
                  />
                  <span
                    className={
                      item.valid
                        ? "text-slate-700"
                        : "text-slate-400 line-through"
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <RejectModal
          doctor={doctor}
          failedItems={failedItems}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}