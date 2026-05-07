import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import { useDoctors } from "@/hooks/useDoctors";

const TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "active" },
  { label: "Rejected", value: "suspended" },
];

// Normalise a single doctor entry regardless of API shape.
function normaliseDoctor(doc) {
  if (!doc) return null;

  // Shape A — nested under 'basic info'
  if (doc["basic info"]) {
    const basic = doc["basic info"];
    const prof = doc.professional_details || {};
    const subInfo = doc.submission_info || {};

    return {
      id: basic.id,
      name: basic.name || "—",
      email: doc.email || "—",
      profile_picture: basic.profile_picture || null,
      specialty: basic.specialty || prof.specialty || "—",
      experience_years: prof.experience_years ?? null,
      submitted_at: subInfo.submitted_at || "—",
      status: doc.status || "pending",
    };
  }

  // Shape B — flat object (most common from DoctorDetailsResource)
  return {
    id: doc.id,
    name:
      doc.name ||
      `${doc.first_name || ""} ${doc.last_name || ""}`.trim() ||
      "—",
    email: doc.email || "—",
    profile_picture: doc.profile_picture || doc.avatar || null,
    specialty: doc.specialty || doc.specialization || "—",
    experience_years: doc.experience_years ?? null,
    submitted_at: doc.submitted_at || doc.created_at || "—",
    status: doc.status || "pending",
  };
}

// Avatar with initials fallback
const BASE_URL = import.meta.env.VITE_BASE_URL || "";

function DoctorAvatar({ src, name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "DR";

  const resolvedSrc = src
    ? src.startsWith("http")
      ? src
      : `${BASE_URL}${src}`
    : null;

  if (!resolvedSrc) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center shrink-0">
        <span className="text-xs font-semibold text-white">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={name}
      className="w-8 h-8 rounded-full object-cover bg-slate-100 shrink-0"
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  );
}

function EmptyState({ search, activeTab }) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <UserCheck size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-700">No doctors found</p>
          <p className="text-xs text-slate-400">
            {search
              ? `No results for "${search}"`
              : activeTab
                ? `No doctors with status "${activeTab}"`
                : "No doctor applications yet"}
          </p>
        </div>
      </td>
    </tr>
  );
}

export default function DoctorVerificationPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = {
    page,
    ...(search && { "filter[global]": search }),
    ...(activeTab && { "filter[status]": activeTab }),
  };

  const { data: rawData, isLoading, isError } = useDoctors(queryParams);

  // Resolve doctors array from whatever shape the API returns
  const rawDoctors = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  const doctors = rawDoctors.map(normaliseDoctor).filter(Boolean);

  const meta = rawData?.meta || {};
  const totalPages = meta.last_page || 1;
  const totalCount = meta.total || doctors.length;

  // Status counts — available only when the collection provides them.
  // If not in the response we show nothing (avoid showing wrong zeros).
  const counts = rawData?.counts || rawData?.stats || null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Verification"
        subtitle="Review and verify doctor applications"
      />

      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">
        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-[#E5E5E5]">
          <div className="flex gap-6">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-[#0066CC] text-[#0066CC]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {counts && tab.value === "" && (
                  <span
                    className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === ""
                        ? "bg-blue-50 text-[#0066CC]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {counts.total ?? totalCount}
                  </span>
                )}
                {counts && tab.value === "pending" && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {counts.pending ?? 0}
                  </span>
                )}
                {counts && tab.value === "active" && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {counts.approved ?? counts.active ?? 0}
                  </span>
                )}
                {counts && tab.value === "suspended" && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {counts.rejected ?? counts.suspended ?? 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table body */}
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-slate-50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-500 font-medium">
              Failed to load doctors
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  {[
                    "DOCTOR NAME",
                    "SPECIALTY",
                    "EXPERIENCE",
                    "SUBMISSION DATE",
                    "STATUS",
                    "ACTIONS",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <EmptyState search={search} activeTab={activeTab} />
                ) : (
                  doctors.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <DoctorAvatar
                            src={doc.profile_picture}
                            name={doc.name}
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {doc.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {doc.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {doc.specialty}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {doc.experience_years != null
                          ? `${doc.experience_years} yrs`
                          : "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {doc.submitted_at}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={doc.status} />
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() =>
                            navigate(`/doctor-verification/${doc.id}`)
                          }
                          className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#0052a3] font-medium transition-colors"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#E5E5E5] flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing {doctors.length} of {totalCount} doctors
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="p-2 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-slate-600">
              {page} / {meta.last_page || 1}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === meta.last_page}
              className="p-2 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
