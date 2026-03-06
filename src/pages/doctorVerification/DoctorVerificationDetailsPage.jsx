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
import { doctorApplications } from "@/features/doctorVerification/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import RejectModal from "./components/RejectModal";
import { toast } from "sonner";

export default function DoctorVerificationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [status, setStatus] = useState(null);

  const doctor = doctorApplications.find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-slate-400">Doctor not found</span>
      </div>
    );
  }

  const currentStatus = status || doctor.status;

  const handleApprove = () => {
    setStatus("Approved");
    toast.success("Doctor approved successfully!");
  };

  const handleReject = (reason) => {
    setStatus("Rejected");
    setShowRejectModal(false);
    toast.error(`Application rejected.`);
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
        {currentStatus === "Pending" && (
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
          </div>
        )}

        {currentStatus !== "Pending" && <StatusBadge status={currentStatus} />}
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
                  {doctor.name.charAt(3)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{doctor.name}</p>
                <p className="text-sm text-slate-500">{doctor.specialty}</p>
                <p className="text-xs text-slate-400">{doctor.subSpecialty}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                {doctor.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                {doctor.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                {doctor.address}
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Professional Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">License Number</p>
                <p className="text-sm font-medium text-slate-900">
                  {doctor.licenseNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Years of Experience
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {doctor.yearsOfExperience} years
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Medical School</p>
                <p className="text-sm font-medium text-slate-900">
                  {doctor.medicalSchool}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Graduation Year</p>
                <p className="text-sm font-medium text-slate-900">
                  {doctor.graduationYear}
                </p>
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
                        PDF • {cert.size} • Uploaded {cert.date}
                      </p>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <Download size={16} className="text-slate-500" />
                  </button>
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

          {/* Verification Checklist */}
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[10px] p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Verification Checklist
            </h2>
            <div className="space-y-2.5">
              {doctor.verificationChecklist.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <CheckCircle
                    size={14}
                    className="text-green-500 mt-0.5 shrink-0"
                  />
                  {item}
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
