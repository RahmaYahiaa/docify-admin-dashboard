import { useState } from "react";
import {
  Search,
  CreditCard,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/shared/PageHeader";
import PaymentDetailsModal from "./components/PaymentDetailsModal";
import RefundDetailsModal from "./components/RefundDetailsModal";
import RetryRefundModal from "./components/RetryRefundModal";

import { usePayments, useRefunds } from "@/hooks/usePayments";
import { formatAppointmentId } from "@/utils/formatters";

const PAYMENT_STATUS = {
  paid: "text-green-600 bg-green-50",
  pending: "text-orange-500 bg-orange-50",
  failed: "text-red-600 bg-red-50",
  refunded: "text-blue-600 bg-blue-50",
};

const formatTransactionId = (id) => {
  if (!id) return "—";
  return `PAY-${String(id).padStart(4, "0")}`;
};

function Badge({ label, styles }) {
  const style = styles[label?.toLowerCase()] || "text-slate-600 bg-slate-100";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("payments");
  const [page, setPage] = useState(1);

  const [viewPayment, setViewPayment] = useState(null);
  const [viewRefund, setViewRefund] = useState(null);
  const [retryRefund, setRetryRefund] = useState(null);

  const [showFilters, setShowFilters] = useState(false);

  const [paymentFilters, setPaymentFilters] = useState({
    payment_method: "",
    status: "",
  });

  const [refundFilters, setRefundFilters] = useState({
    refund_type: "",
  });

  const { data: paymentsData, isLoading: loadingPayments } = usePayments({
    ...(paymentFilters.payment_method && {
      "filter[payment_method]": paymentFilters.payment_method,
    }),
    ...(paymentFilters.status && {
      "filter[status]": paymentFilters.status,
    }),
    page,
  });

  const { data: refundsData, isLoading: loadingRefunds } = useRefunds({
    ...(refundFilters.refund_type && {
      "filter[refund_type]": refundFilters.refund_type,
    }),
    page,
  });

  const payments = paymentsData?.data || [];
  const refunds = refundsData?.data || [];
  const paymentsMeta = paymentsData?.meta || {};
  const refundsMeta = refundsData?.meta || {};
  const paymentsCount = paymentsData?.payments_count ?? 0;
  const refundsCount = refundsData?.refunds_count ?? 0;

  const handleRetry = (refund) => {
    toast.success(`Refund ${refund.refund_id} is being retried`);
    setRetryRefund(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments & Refunds"
        subtitle="Monitor all financial transactions"
      />

      <div className="bg-white rounded-[10px] border border-[#E5E5E5]">
        {/* Search + Filters */}
        <div className="p-4 border-b border-[#E5E5E5] space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search is not supported yet"
                disabled
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg bg-slate-50 text-slate-400 cursor-not-allowed"
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

          {/* Payments Filters */}
          {showFilters && activeTab === "payments" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Payment Method
                </label>
                <select
                  value={paymentFilters.payment_method}
                  onChange={(e) => {
                    setPaymentFilters((prev) => ({
                      ...prev,
                      payment_method: e.target.value,
                    }));
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#D9D9D9] rounded-xl outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={paymentFilters.status}
                  onChange={(e) => {
                    setPaymentFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#D9D9D9] rounded-xl outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          )}

          {/* Refund Filters */}
          {showFilters && activeTab === "refunds" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Refund Type
                </label>
                <select
                  value={refundFilters.refund_type}
                  onChange={(e) => {
                    setRefundFilters((prev) => ({
                      ...prev,
                      refund_type: e.target.value,
                    }));
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#D9D9D9] rounded-xl outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="">All Types</option>
                  <option value="full">Full</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-[#E5E5E5]">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {[
              { label: "Payments", value: "payments", count: paymentsCount },
              { label: "Refunds", value: "refunds", count: refundsCount },
            ].map((tab) => (
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
                {tab.label}
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value
                      ? "bg-blue-50 text-[#0066CC]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Payments Table */}
        {activeTab === "payments" &&
          (loadingPayments ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    {[
                      "TRANSACTION ID",
                      "APPOINTMENT ID",
                      "PATIENT",
                      "DOCTOR",
                      "METHOD",
                      "AMOUNT",
                      "STATUS",
                      "DATE & TIME",
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
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-12 text-center text-sm text-slate-400"
                      >
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr
                        key={p.transaction_id}
                        className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-4 text-xs font-semibold font-mono text-slate-700">
                          {formatTransactionId(p.transaction_id)}
                        </td>
                        <td className="px-4 py-4 text-xs font-mono text-slate-500">
                          {formatAppointmentId(p.appointment_id)}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {p.patient}
                          </p>
                          {/* <p className="text-xs text-slate-400">
                            ID: {p.patient_id}
                          </p> */}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {p.doctor}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            {p.payment_method === "card" ? (
                              <CreditCard size={13} className="text-blue-500" />
                            ) : (
                              <Banknote size={13} className="text-green-500" />
                            )}
                            <span className="text-sm text-slate-600 capitalize">
                              {p.payment_method}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                          ${p.amount}
                        </td>
                        <td className="px-4 py-4">
                          <Badge label={p.status} styles={PAYMENT_STATUS} />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-900">{p.date}</p>
                          <p className="text-xs text-slate-400">{p.time}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ))}

        {/* Refunds Table */}
        {activeTab === "refunds" &&
          (loadingRefunds ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    {[
                      "REFUND ID",
                      "TRANSACTION ID",
                      "APPOINTMENT ID",
                      "PATIENT",
                      "AMOUNT",
                      "TYPE",
                      "DATE & TIME",
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
                  {refunds.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-sm text-slate-400"
                      >
                        No refunds found
                      </td>
                    </tr>
                  ) : (
                    refunds.map((r) => (
                      <tr
                        key={r.refund_id}
                        className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-4 text-xs font-mono text-slate-600">
                          REF-{String(r.refund_id).padStart(4, "0")}
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold font-mono text-slate-700">
                          {formatTransactionId(r.transaction_id)}
                        </td>
                        <td className="px-4 py-4 text-xs font-mono text-slate-500">
                          {formatAppointmentId(r.appointment_id)}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {r.patient}
                          </p>
                          {/* <p className="text-xs text-slate-400">
                            ID: {r.patient_id}
                          </p> */}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                          ${r.refund_amount}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 capitalize">
                          {r.refund_type}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-900">{r.date}</p>
                          <p className="text-xs text-slate-400">{r.time}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ))}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-sm text-slate-500">
            Showing{" "}
            {activeTab === "payments" ? payments.length : refunds.length} of{" "}
            {activeTab === "payments"
              ? (paymentsMeta.total ?? 0)
              : (refundsMeta.total ?? 0)}{" "}
            {activeTab}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="p-2 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-slate-600">
              {page} /{" "}
              {activeTab === "payments"
                ? (paymentsMeta.last_page ?? 1)
                : (refundsMeta.last_page ?? 1)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={
                page ===
                (activeTab === "payments"
                  ? paymentsMeta.last_page
                  : refundsMeta.last_page)
              }
              className="p-2 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewPayment && (
        <PaymentDetailsModal
          payment={viewPayment}
          onClose={() => setViewPayment(null)}
        />
      )}
      {viewRefund && (
        <RefundDetailsModal
          refund={viewRefund}
          onClose={() => setViewRefund(null)}
        />
      )}
      {retryRefund && (
        <RetryRefundModal
          refund={retryRefund}
          onClose={() => setRetryRefund(null)}
          onConfirm={handleRetry}
        />
      )}
    </div>
  );
}