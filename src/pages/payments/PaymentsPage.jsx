import { useState } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  CreditCard,
  Banknote,
  ChevronLeft,
  ChevronRight,
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
};

const REFUND_STATUS = {
  completed: "text-green-600 bg-green-50",
  failed: "text-red-600 bg-red-50",
  processing: "text-orange-500 bg-orange-50",
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewPayment, setViewPayment] = useState(null);
  const [viewRefund, setViewRefund] = useState(null);
  const [retryRefund, setRetryRefund] = useState(null);

  const { data: paymentsData, isLoading: loadingPayments } = usePayments({
    ...(search && { "filter[search]": search }),
    page,
  });

  const { data: refundsData, isLoading: loadingRefunds } = useRefunds({
    ...(search && { "filter[search]": search }),
    page,
  });

  const payments = paymentsData?.data || [];
  const refunds = refundsData?.data || [];
  const paymentsMeta = paymentsData?.meta || {};
  const refundsMeta = refundsData?.meta || {};
  const paymentsCount = paymentsData?.payments_count ?? 0;
  const refundsCount = paymentsData?.refunds_count ?? 0;

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
        <div className="p-4 border-b border-[#E5E5E5]">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>
        </div>

        <div className="px-4 border-b border-[#E5E5E5]">
          <div className="flex gap-6">
            {[
              { label: "Payments", value: "payments", count: paymentsCount },
              { label: "Refunds", value: "refunds", count: refundsCount },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setSearch("");
                  setPage(1);
                }}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
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
            <table className="w-full">
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
                      colSpan={9}
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
                      <td className="px-4 py-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                        {p.transaction_id}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {formatAppointmentId(p.appointment_id)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {p.patient}
                        </p>
                        <p className="text-xs text-slate-400">
                          ID: {p.patient_id}
                        </p>
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
                      {/* <td className="px-4 py-4">
                      <button
                        onClick={() => setViewPayment(p)}
                        className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={15} />
                      </button>
                    </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  {[
                    "REFUND ID",
                    "TRANSACTION ID",
                    "APPOINTMENT ID",
                    "PATIENT",
                    "AMOUNT",
                    "TYPE",
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
                {refunds.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
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
                      <td className="px-4 py-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                        REF-{String(r.refund_id).padStart(4, "0")}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {r.transaction_id}
                      </td>
                      <td className="px-4 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                        {formatAppointmentId(r.appointment_id)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {r.patient}
                        </p>
                        <p className="text-xs text-slate-400">
                          ID: {r.patient_id}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        ${r.refund_amount}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 capitalize">
                        {r.refund_type || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <Badge label={r.status} styles={REFUND_STATUS} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-900">{r.date}</p>
                        <p className="text-xs text-slate-400">{r.time}</p>
                      </td>
                      {/* <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewRefund(r)}
                          className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        {r.status?.toLowerCase() === 'failed' && (
                          <button
                            onClick={() => setRetryRefund(r)}
                            className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <RefreshCw size={15} />
                          </button>
                        )}
                      </div>
                    </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ))}

        <div className="px-4 py-3 border-t border-[#E5E5E5] flex items-center justify-between">
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
          onRetry={(r) => setRetryRefund(r)}
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
