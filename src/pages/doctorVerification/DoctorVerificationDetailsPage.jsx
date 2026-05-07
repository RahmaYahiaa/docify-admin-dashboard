import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        name: rawDoctor["basic info"]?.name || "—",
        phone: rawDoctor["basic info"]?.phone || "—",
        specialty: rawDoctor["basic info"]?.specialty || "—",
        profile_picture: rawDoctor["basic info"]?.profile_picture || null,
        email: rawDoctor.email || "—",
        address: rawDoctor.address || "—",
        status: rawDoctor.status || "pending",
        about: rawDoctor.about || "—",
        yearsOfExperience:
          rawDoctor.professional_details?.experience_years ?? null,
        submissionDate: rawDoctor.submission_info?.submitted_at || "—",
        certificates: rawDoctor.uploaded_certificate
          ? [rawDoctor.uploaded_certificate]
          : [],
      }
    : null;
  const [checklistState, setChecklistState] = useState([
    { label: "Medical certificate uploaded", valid: false },
    { label: "Doctor profile information completed", valid: false },
    { label: "Phone number provided", valid: false },
    { label: "Email address verified", valid: false },
  ]);
  // const [checklistState, setChecklistState] = useState([]);
  // useEffect(() => {
  //   if (rawDoctor?.verificationChecklist) {
  //     setChecklistState(rawDoctor.verificationChecklist);
  //   }
  // }, [rawDoctor]);
  const approveMutation = useApproveDoctor();
  const rejectMutation = useRejectDoctor();

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

  const currentStatus = localStatus ?? doctor.status;
  const isActionAllowed = currentStatus?.toLowerCase() !== "approved";

  const handleApprove = () => {
    approveMutation.mutate(id, {
      onSuccess: () => {
        setLocalStatus("approved");
      },
    });
  };

  const handleReject = (reason) => {
    rejectMutation.mutate(
      { id, reason },
      {
        onSuccess: () => {
          setLocalStatus("rejected");
          setShowRejectModal(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        {isActionAllowed && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X size={16} />
              Reject
            </button>

            <button
              onClick={handleApprove}
              disabled={approveMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={16} />
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </button>
          </div>
        )}

        {/* {currentStatus !== "pending" &&
          currentStatus !== "Pending" && (
            <StatusBadge status={currentStatus} />
          )} */}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left — Doctor Info (2 cols) */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Doctor Information
            </h2>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-lg font-semibold text-slate-600">
                  {doctor.name?.charAt(0)?.toUpperCase() || "D"}
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-900">{doctor.name}</p>

                <p className="text-sm text-slate-500">
                  {doctor.specialty || "—"}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400 shrink-0" />

                <span className="break-all">{doctor.email || "—"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400 shrink-0" />

                <span>{doctor.phone || "—"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400 shrink-0" />

                <span>{doctor.address || "—"}</span>
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
              {(doctor.certificates || []).map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-[#E5E5E5] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-red-500">
                        PDF
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {cert.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        PDF • Uploaded Certificate
                      </p>
                    </div>
                  </div>

                  <a
                    href={cert.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Download size={16} className="text-slate-500" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Submission Info (1 col) */}
        <div className="space-y-6">
          {/* Submission Info */}
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
                    {doctor.submissionDate || doctor.submitted_at || "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Current Status</p>

                <StatusBadge status={currentStatus} />
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[10px] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Verification Checklist
            </h2>

            <div className="space-y-2.5">
              {/* {(doctor.verificationChecklist || []).map( */}
              {checklistState.map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <button
                    onClick={() => {
                      setChecklistState((prev) =>
                        prev.map((c, i) =>
                          i === index ? { ...c, valid: !c.valid } : c,
                        ),
                      );
                    }}
                  >
                    <CheckCircle
                      size={14}
                      className={
                        item.valid ? "text-green-500" : "text-slate-300"
                      }
                    />
                  </button>

                  <span
                    className={item.valid ? "text-slate-700" : "text-slate-400"}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          doctor={doctor}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}
