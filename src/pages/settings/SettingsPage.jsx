import { useState } from 'react'
import {
  CreditCard, Banknote, RefreshCw, Clock,
  Save, RotateCcw, AlertTriangle, Info,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'

// ── Toggle Switch ──
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-[#0066CC]' : 'bg-slate-200'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  )
}

// ── Section Header ──
function SectionHeader({ icon: Icon, iconColor, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-[#E5E5E5]">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconColor}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  )
}

const NO_SHOW_OPTIONS = [5, 10, 15, 20, 30]

const DEFAULT_SETTINGS = {
  cardPayments: true,
  cashPayments: true,
  cancellationRefund: true,
  noShowThreshold: 15,
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(DEFAULT_SETTINGS)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)

  const update = (key, value) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    setHasChanges(JSON.stringify(next) !== JSON.stringify(saved))
  }

  const handleSave = () => {
    setSaved(settings)
    setHasChanges(false)
    toast.success('Settings saved successfully!')
  }

  const handleReset = () => {
    setSettings(saved)
    setHasChanges(false)
  }

  const noPaymentWarning = !settings.cardPayments && !settings.cashPayments

  return (
    <div className="space-y-6">

      <PageHeader
        title="System Settings"
        subtitle="Configure platform payment and policy settings"
      />

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="flex items-center gap-3 bg-[#FFF7ED] border border-orange-200 rounded-[10px] px-4 py-4">
          <Info size={16} className="text-orange-500 shrink-0" />
          <p className="text-sm text-orange-700">
            You have unsaved changes. Click "Save Changes" to apply them.
          </p>
        </div>
      )}

      {/* ── Payment Methods ── */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6 space-y-4">
        <SectionHeader
          icon={CreditCard}
          iconColor="bg-blue-100 text-blue-600"
          title="Payment Methods"
          subtitle="Enable or disable payment options for patients"
        />

        {/* Card Payments */}
        <div className="flex items-center justify-between py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard size={15} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Card Payments</p>
              <p className="text-xs text-slate-400">Allow patients to pay using credit or debit cards</p>
              <p className="text-xs text-slate-400">Includes: Visa, Mastercard, American Express</p>
              <div className="mt-1.5">
                {settings.cardPayments ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={11} /> Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-500">
                    <AlertTriangle size={11} /> Disabled
                  </span>
                )}
              </div>
            </div>
          </div>
          <Toggle enabled={settings.cardPayments} onChange={(v) => update('cardPayments', v)} />
        </div>

        {/* Cash Payments */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Banknote size={15} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Cash Payments</p>
              <p className="text-xs text-slate-400">Allow patients to pay with cash at the clinic</p>
              <p className="text-xs text-slate-400">Payment collected in person during appointment</p>
              <div className="mt-1.5">
                {settings.cashPayments ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={11} /> Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-500">
                    <AlertTriangle size={11} /> Disabled
                  </span>
                )}
              </div>
            </div>
          </div>
          <Toggle enabled={settings.cashPayments} onChange={(v) => update('cashPayments', v)} />
        </div>

        {/* No Payment Warning */}
        {noPaymentWarning && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-[10px] px-4 py-3">
            <AlertTriangle size={15} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700">
              Warning: No payment methods enabled. Patients will not be able to complete bookings. Please enable at least one payment method.
            </p>
          </div>
        )}
      </div>

      {/* ── Appointment Policies ── */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5] p-6 space-y-4">
        <SectionHeader
          icon={RefreshCw}
          iconColor="bg-purple-100 text-purple-600"
          title="Appointment Policies"
          subtitle="Configure cancellation and no-show policies"
        />

        {/* Cancellation Refund */}
        <div className="flex items-center justify-between py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <RefreshCw size={15} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Cancellation Refund Policy</p>
              <p className="text-xs text-slate-400">Automatically issue refunds when appointments are cancelled</p>
              <p className="text-xs text-slate-400">When enabled, patients will receive automatic refunds for cancelled appointments</p>
              <div className="mt-1.5">
                {settings.cancellationRefund ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={11} /> Refunds Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-red-500">
                    <AlertTriangle size={11} /> Refunds Disabled
                  </span>
                )}
              </div>
            </div>
          </div>
          <Toggle enabled={settings.cancellationRefund} onChange={(v) => update('cancellationRefund', v)} />
        </div>

        {/* No-Show Threshold */}
        <div className="py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock size={15} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">No-Show Time Threshold</p>
              <p className="text-xs text-slate-400">Set the time after appointment start when patient is marked as no-show</p>
              <p className="text-xs text-slate-400">If a patient doesn't arrive within this time, the appointment will be marked as no-show</p>
            </div>
          </div>

          <div className="ml-11">
            <p className="text-xs font-medium text-slate-600 mb-2">Time Threshold</p>
            <div className="flex items-center gap-2">
              {NO_SHOW_OPTIONS.map((min) => (
                <button
                  key={min}
                  onClick={() => update('noShowThreshold', min)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    settings.noShowThreshold === min
                      ? 'bg-[#0066CC] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {min} minutes
                </button>
              ))}
            </div>
            <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
              <Info size={11} />
              Current threshold: {settings.noShowThreshold} minutes
            </p>
          </div>
        </div>
      </div>

      {/* ── Save Bar ── */}
      <div className="bg-white rounded-[10px] border border-[#E5E5E5] px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Save Your Changes</p>
          <p className="text-xs text-slate-400">Changes will take effect immediately after saving</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Current Configuration ── */}
      <div className="bg-[#FAFAFA] rounded-[10px] border border-[#E5E5E5] px-6 py-5">
        <p className="text-sm font-semibold text-slate-900 mb-4">Current Configuration</p>
        <div className="grid grid-cols-2 gap-x-16 gap-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[#E5E5E5]">
            <span className="text-sm text-slate-600">Card Payments</span>
            <span className={`text-sm font-medium ${saved.cardPayments ? 'text-green-600' : 'text-red-500'}`}>
              {saved.cardPayments ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#E5E5E5]">
            <span className="text-sm text-slate-600">Cash Payments</span>
            <span className={`text-sm font-medium ${saved.cashPayments ? 'text-green-600' : 'text-red-500'}`}>
              {saved.cashPayments ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">Cancellation Refunds</span>
            <span className={`text-sm font-medium ${saved.cancellationRefund ? 'text-green-600' : 'text-red-500'}`}>
              {saved.cancellationRefund ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">No Show Threshold</span>
            <span className="text-sm font-medium text-slate-900">
              {saved.noShowThreshold} minutes
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}