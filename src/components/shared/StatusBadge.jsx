const STATUS_STYLES = {
  active:    'bg-green-50 text-green-700 border border-green-200',
  pending:   'bg-orange-50 text-orange-700 border border-orange-200',
  suspended: 'bg-red-50 text-red-700 border border-red-200',
  disabled:  'bg-red-50 text-red-700 border border-red-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-slate-100 text-slate-600 border border-slate-200',
  failed:    'bg-red-50 text-red-700 border border-red-200',
}

const STATUS_DOTS = {
  active:    'bg-green-500',
  pending:   'bg-orange-500',
  suspended: 'bg-red-500',
  disabled:  'bg-red-500',
  completed: 'bg-green-500',
  cancelled: 'bg-slate-400',
  failed:    'bg-red-500',
}

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase()
  const style = STATUS_STYLES[key] || 'bg-slate-100 text-slate-600'
  const dot = STATUS_DOTS[key] || 'bg-slate-400'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}