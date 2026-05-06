import { useState } from "react";
import {
  Search,
  Eye,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/shared/StatsCard";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import { useAppointments } from "@/hooks/useAppointments";
import { formatAppointmentId, formatStatus } from "@/utils/formatters";
import { Calendar, CheckCircle, UserX } from "lucide-react";

const TABS = [
  { label: "All", value: "" },
  { label: "Upcoming", value: "confirmed" },
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
  refunded: "text-blue-600 bg-blue-50",
  failed: "text-red-600 bg-red-50",
};

function StatusBadge({ status, styles }) {
  const style = styles[status] || "text-slate-600 bg-slate-100";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {formatStatus(status)}
    </span>
  );
}

export default function AppointmentsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const [viewAppointment, setViewAppointment] = useState(null);

  const { data, isLoading, isError } = useAppointments({
    ...(search && { "filter[search]": search }),
    ...(activeTab && { "filter[status]": activeTab }),
    page,
  });

  const appointments = data?.data || [];
  const stats = data?.stats || {};
  const meta = data?.meta || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments Oversight"
        subtitle="Monitor and manage all platform appointments"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total"
          value={isLoading ? "—" : (stats.all ?? 0)}
          icon={Calendar}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Upcoming"
          value={isLoading ? "—" : (stats.confirmed ?? 0)}
          icon={Calendar}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Completed"
          value={isLoading ? "—" : (stats.completed ?? 0)}
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatsCard
          title="No Show"
          value={isLoading ? "—" : (stats.no_show ?? 0)}
          icon={UserX}
          iconColor="text-red-500"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">
        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
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
                {tab.value === "" && (
                  <span
                    className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.value
                        ? "bg-blue-50 text-[#0066CC]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {stats.all ?? 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
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
          <div className="p-8 text-center text-sm text-red-500">
            Failed to load appointments
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              {/* THEAD */}
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

              {/* TBODY */}
              <tbody>
                {appointments.map((apt) => (
                  <tr
                    key={apt.appointment_id}
                    className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    {/* Appointment ID */}
                    <td className="px-4 py-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                      {formatAppointmentId(apt.appointment_id)}
                    </td>

                    {/* Patient */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {apt.patient}
                      </p>
                    </td>

                    {/* Doctor */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {apt.doctor}
                      </p>
                      <p className="text-xs text-slate-400">
                        {apt.specialty || "—"}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-900">{apt.date}</p>
                      <p className="text-xs text-slate-400">{apt.time}</p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {apt.type === "video" ? (
                          <Video size={13} className="text-purple-500" />
                        ) : (
                          <MapPin size={13} className="text-blue-500" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            apt.type === "video"
                              ? "text-purple-600"
                              : "text-blue-600"
                          }`}
                        >
                          {apt.type === "video" ? "Video" : "In-person"}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={apt.status} styles={STATUS_STYLES} />
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-4">
                      {apt.payment_status ? (
                        <StatusBadge
                          status={apt.payment_status}
                          styles={PAYMENT_STYLES}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer + Pagination */}
        {meta.total > 0 && (
          <div className="px-4 py-3 border-t border-[#E5E5E5] flex items-center justify-between">
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

      {/* Details Modal */}
      {viewAppointment && (
        <AppointmentDetailsModal
          appointment={viewAppointment}
          onClose={() => setViewAppointment(null)}
        />
      )}
    </div>
  );
}
