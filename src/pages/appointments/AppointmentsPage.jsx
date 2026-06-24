import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Calendar,
  CheckCircle,
  UserX,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/shared/StatsCard";
import { useAppointments } from "@/hooks/useAppointments";
import { formatAppointmentId, formatStatus } from "@/utils/formatters";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";

const TABS = [
  { label: "All", value: "", countKey: "all" },
  { label: "Upcoming", value: "confirmed", countKey: "confirmed" },
  { label: "Completed", value: "completed", countKey: "completed" },
  { label: "Cancelled", value: "cancelled", countKey: "cancelled" },
  { label: "No Show", value: "no_show", countKey: "no_show" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Confirmed / Upcoming", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No Show", value: "no_show" },
];

const STATUS_STYLES = {
  confirmed: "text-blue-600 bg-blue-50",
  completed: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
  no_show: "text-slate-600 bg-slate-100",
};

const PAYMENT_STYLES = {
  paid: "text-green-600 bg-green-50",
  pending: "text-orange-500 bg-orange-50",
  cash: "text-indigo-600 bg-indigo-50", // الاستايل الخاص بالدفع الكاش
  refunded: "text-blue-600 bg-blue-50",
  failed: "text-red-600 bg-red-50",
  not_applicable: "text-slate-500 bg-slate-100",
};

function StatusBadge({ status, styles }) {
  const style = styles[status] || "text-slate-600 bg-slate-100";

  const displayTxt = status === "cash" ? "Cash" : formatStatus(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {displayTxt}
    </span>
  );
}

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [viewAppointment, setViewAppointment] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, isLoading, isError } = useAppointments(
    {
      ...(debouncedSearch && { "filter[search]": debouncedSearch }),
      ...(activeTab && { "filter[status]": activeTab }),
      ...(typeFilter && { "filter[type]": typeFilter }),
      page,
    },
    {
      placeholderData: (previousData) => previousData,
    },
  );

  const appointments = data?.data || [];
  const stats = data?.stats || {};
  const meta = data?.meta || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments Oversight"
        subtitle="Monitor and manage all platform appointments"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total"
          value={stats.all ?? 0}
          icon={Calendar}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Upcoming"
          value={stats.confirmed ?? 0}
          icon={Calendar}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Completed"
          value={stats.completed ?? 0}
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatsCard
          title="No Show"
          value={stats.no_show ?? 0}
          icon={UserX}
          iconColor="text-red-500"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">
        {/* Top Bar */}
        <div className="p-4 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showFilters
                ? "bg-[#0066CC] text-white border-[#0066CC]"
                : "text-slate-700 border-[#E5E5E5] hover:bg-slate-50"
            }`}
          >
            <Filter size={15} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-slate-50 border-b border-[#E5E5E5] flex flex-wrap gap-6">
            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Appointment Type
              </label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-3 pr-8 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none bg-white focus:border-[#0066CC] transition-colors appearance-none cursor-pointer text-slate-700 font-medium"
                >
                  <option value="">All Types</option>
                  <option value="video">Video</option>
                  <option value="in_person">In-person</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Appointment Status
              </label>
              <div className="relative">
                <select
                  value={activeTab}
                  onChange={(e) => {
                    setActiveTab(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-3 pr-8 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none bg-white focus:border-[#0066CC] transition-colors appearance-none cursor-pointer text-slate-700 font-medium"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-4 border-b border-[#E5E5E5]">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.value
                    ? "border-[#0066CC] text-[#0066CC]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.value
                        ? "bg-blue-50 text-[#0066CC]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {stats?.[tab.countKey] ?? 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading && appointments.length === 0 ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-slate-50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-red-500">
            Failed to load appointments
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  {[
                    "APPOINTMENT ID",
                    "PATIENT",
                    "DOCTOR",
                    "DATE & TIME",
                    "TYPE",
                    "STATUS",
                    "PAYMENT",
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
                {appointments.map((apt) => {
                  let displayPaymentStatus = apt.payment_status;

                  if (apt.status === "cancelled" && !apt.payment_status) {
                    displayPaymentStatus = "not_applicable";
                  } else if (
                    apt.type === "in_person" &&
                    (!apt.payment_status || apt.payment_status === "pending")
                  ) {
                    displayPaymentStatus = "cash";
                  }

                  return (
                    <tr
                      key={apt.appointment_id}
                      className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                        {formatAppointmentId(apt.appointment_id)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {apt.patient}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {apt.doctor}
                        </p>
                        <p className="text-xs text-slate-400">
                          {apt.specialty ? apt.specialty : "General Medicine"}
                        </p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-900">{apt.date}</p>
                        <p className="text-xs text-slate-400">{apt.time}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          {apt.type === "video" ? (
                            <Video size={13} className="text-purple-500" />
                          ) : (
                            <MapPin size={13} className="text-blue-500" />
                          )}
                          <span
                            className={`text-xs font-medium ${apt.type === "video" ? "text-purple-600" : "text-blue-600"}`}
                          >
                            {apt.type === "video" ? "Video" : "In-person"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          status={apt.status}
                          styles={STATUS_STYLES}
                        />
                      </td>
                      <td className="px-4 py-4">
                        {displayPaymentStatus ? (
                          <StatusBadge
                            status={displayPaymentStatus}
                            styles={PAYMENT_STYLES}
                          />
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setViewAppointment(apt)}
                          className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer + Pagination */}
        {meta.total > 0 && (
          <div className="px-4 py-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-sm text-slate-500">
              Showing {appointments.length} of {meta.total || 0} appointments
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
        )}
      </div>

      {viewAppointment && (
        <AppointmentDetailsModal
          appointment={viewAppointment}
          onClose={() => setViewAppointment(null)}
        />
      )}
    </div>
  );
}
