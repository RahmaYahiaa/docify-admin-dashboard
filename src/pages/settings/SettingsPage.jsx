// import { useState, useEffect } from "react";
// import {
//   CreditCard,
//   Banknote,
//   RefreshCw,
//   Clock,
//   Save,
//   RotateCcw,
//   AlertTriangle,
//   Info,
//   CheckCircle,
// } from "lucide-react";
// import PageHeader from "@/components/shared/PageHeader";
// import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

// function Toggle({ enabled, onChange }) {
//   return (
//     <button
//       onClick={() => onChange(!enabled)}
//       className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
//         enabled ? "bg-[#0066CC]" : "bg-slate-200"
//       }`}
//     >
//       <span
//         className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
//           enabled ? "translate-x-5" : "translate-x-0"
//         }`}
//       />
//     </button>
//   );
// }

// function SectionHeader({ icon: Icon, iconColor, title, subtitle }) {
//   return (
//     <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
//       <div
//         className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}
//       >
//         <Icon size={16} />
//       </div>
//       <div>
//         <p className="text-sm font-semibold text-slate-900">{title}</p>
//         <p className="text-xs text-slate-400">{subtitle}</p>
//       </div>
//     </div>
//   );
// }


// // map API keys to local state keys
// const API_KEY_MAP = {
//   card_payments: "cardPayments",
//   cash_payments: "cashPayments",
//   cancellation_refund: "cancellationRefund",
// };

// const DEFAULT_SETTINGS = {
//   cardPayments: true,
//   cashPayments: true,
//   cancellationRefund: true,
// };

// export default function SettingsPage() {
//   const { data: apiSettings, isLoading } = useSettings();
//   const { mutate: saveSettings, isPending: saving } = useUpdateSettings();

//   const [saved, setSaved] = useState(DEFAULT_SETTINGS);
//   const [settings, setSettings] = useState(DEFAULT_SETTINGS);
//   const [hasChanges, setHasChanges] = useState(false);

//   useEffect(() => {
//     if (!apiSettings) return;
//     const mapped = { ...DEFAULT_SETTINGS };
//     apiSettings.forEach((s) => {
//       const localKey = API_KEY_MAP[s.key];
//       if (localKey) mapped[localKey] = s.is_enabled;
//     });
//     setSettings(mapped);
//     setSaved(mapped);
//   }, [apiSettings]);

//   const update = (key, value) => {
//     const next = { ...settings, [key]: value };
//     setSettings(next);
//     setHasChanges(JSON.stringify(next) !== JSON.stringify(saved));
//   };

//   const handleSave = () => {
//     const reverseMap = Object.fromEntries(
//       Object.entries(API_KEY_MAP).map(([k, v]) => [v, k]),
//     );
//     const changedKeys = Object.keys(settings).filter(
//       (k) => settings[k] !== saved[k] && reverseMap[k],
//     );

//     changedKeys.forEach((localKey) => {
//       saveSettings({
//         key: reverseMap[localKey],
//         is_enabled: settings[localKey],
//       });
//     });
//     setSaved(settings);
//     setHasChanges(false);
//   };

//   const handleReset = () => {
//     setSettings(saved);
//     setHasChanges(false);
//   };

//   const noPaymentWarning = !settings.cardPayments && !settings.cashPayments;

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <PageHeader
//           title="System Settings"
//           subtitle="Configure platform payment and policy settings"
//         />
//         <div className="space-y-4">
//           {[...Array(2)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-[10px] border border-[#E5E5E5] p-6 h-48 animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="System Settings"
//         subtitle="Configure platform payment and policy settings"
//       />

//       {/* Unsaved Changes Banner */}
//       {hasChanges && (
//         <div className="flex items-center gap-3 bg-[#FFF7ED] border border-orange-200 rounded-[10px] px-4 py-4">
//           <Info size={16} className="text-orange-500 shrink-0" />
//           <p className="text-sm text-orange-700">
//             You have unsaved changes. Click "Save Changes" to apply them.
//           </p>
//         </div>
//       )}

//       {/* Payment Methods */}
//       <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-4 sm:p-6 space-y-4">
//         <SectionHeader
//           icon={CreditCard}
//           iconColor="bg-blue-100 text-blue-600"
//           title="Payment Methods"
//           subtitle="Enable or disable payment options for patients"
//         />

//         {/* Card */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-[#E5E5E5]">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
//               <CreditCard size={15} className="text-blue-500" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-slate-900">
//                 Card Payments
//               </p>
//               <p className="text-xs text-slate-400">
//                 Allow patients to pay using credit or debit cards
//               </p>
//               <p className="text-xs text-slate-400">
//                 Includes: Visa, Mastercard, American Express
//               </p>
//               <div className="mt-1.5">
//                 {settings.cardPayments ? (
//                   <span className="inline-flex items-center gap-1 text-xs text-green-600">
//                     <CheckCircle size={11} /> Enabled
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 text-xs text-red-500">
//                     <AlertTriangle size={11} /> Disabled
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//           <Toggle
//             enabled={settings.cardPayments}
//             onChange={(v) => update("cardPayments", v)}
//           />
//         </div>

//         {/* Cash */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
//               <Banknote size={15} className="text-green-500" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-slate-900">
//                 Cash Payments
//               </p>
//               <p className="text-xs text-slate-400">
//                 Allow patients to pay with cash at the clinic
//               </p>
//               <p className="text-xs text-slate-400">
//                 Payment collected in person during appointment
//               </p>
//               <div className="mt-1.5">
//                 {settings.cashPayments ? (
//                   <span className="inline-flex items-center gap-1 text-xs text-green-600">
//                     <CheckCircle size={11} /> Enabled
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 text-xs text-red-500">
//                     <AlertTriangle size={11} /> Disabled
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//           <Toggle
//             enabled={settings.cashPayments}
//             onChange={(v) => update("cashPayments", v)}
//           />
//         </div>

//         {noPaymentWarning && (
//           <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3">
//             <AlertTriangle size={15} className="text-red-500 shrink-0" />
//             <p className="text-sm text-red-700">
//               Warning: No payment methods enabled. Patients will not be able to
//               complete bookings.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Appointment Policies */}
//       <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-4 sm:p-6 space-y-4">
//         <SectionHeader
//           icon={RefreshCw}
//           iconColor="bg-purple-100 text-purple-600"
//           title="Appointment Policies"
//           subtitle="Configure cancellation and no-show policies"
//         />

//         {/* Cancellation Refund */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-[#E5E5E5]">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
//               <RefreshCw size={15} className="text-purple-500" />
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-slate-900">
//                 Cancellation Refund Policy
//               </p>
//               <p className="text-xs text-slate-400">
//                 Automatically issue refunds when appointments are cancelled
//               </p>
//               <div className="mt-1.5">
//                 {settings.cancellationRefund ? (
//                   <span className="inline-flex items-center gap-1 text-xs text-green-600">
//                     <CheckCircle size={11} /> Refunds Enabled
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 text-xs text-red-500">
//                     <AlertTriangle size={11} /> Refunds Disabled
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//           <Toggle
//             enabled={settings.cancellationRefund}
//             onChange={(v) => update("cancellationRefund", v)}
//           />
//         </div>
//       </div>

//       {/* Save Bar */}
//       <div className="bg-white rounded-[10px] border border-[#E5E5E5] px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <p className="text-sm font-semibold text-slate-900">
//             Save Your Changes
//           </p>
//           <p className="text-xs text-slate-400">
//             Changes will take effect immediately after saving
//           </p>
//         </div>
//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <button
//             onClick={handleReset}
//             disabled={!hasChanges}
//             className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             <RotateCcw size={14} />
//             Reset
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!hasChanges || saving}
//             className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             {saving ? (
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//             ) : (
//               <>
//                 <Save size={14} /> Save Changes
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }