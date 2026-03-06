import { useState } from 'react'
import { Plus, Edit, Ban, CheckCircle, Activity } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '@/components/shared/PageHeader'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import DisableSpecialtyModal from './components/DisableSpecialtyModal'
import SpecialtyForm from './components/SpecialtyForm'
import { specialties as initialData } from '@/features/specialties/data/mockData'
import { Stethoscope } from 'lucide-react'

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState(initialData)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editSpecialty, setEditSpecialty] = useState(null)
  const [disableTarget, setDisableTarget] = useState(null)

  const totalActive = specialties.filter((s) => s.status === 'Active').length
  const totalDisabled = specialties.filter((s) => s.status === 'Disabled').length

  const handleSave = (form) => {
    if (editSpecialty) {
      setSpecialties((prev) =>
        prev.map((s) =>
          s.id === editSpecialty.id
            ? { ...s, name: form.name, description: form.description, image: form.image }
            : s
        )
      )
    } else {
      const newSpecialty = {
        id: `SP${Date.now()}`,
        name: form.name,
        description: form.description,
        doctors: 0,
        status: 'Active',
        image: typeof form.image === 'string' ? form.image : URL.createObjectURL(form.image),
      }
      setSpecialties((prev) => [...prev, newSpecialty])
    }
    setEditSpecialty(null)
  }

  const handleDisable = () => {
    setSpecialties((prev) =>
      prev.map((s) =>
        s.id === disableTarget.id ? { ...s, status: 'Disabled' } : s
      )
    )
    toast.success(`"${disableTarget.name}" has been disabled`)
    setDisableTarget(null)
  }

  const handleEnable = (specialty) => {
    setSpecialties((prev) =>
      prev.map((s) =>
        s.id === specialty.id ? { ...s, status: 'Active' } : s
      )
    )
    toast.success(`"${specialty.name}" has been enabled`)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <PageHeader
        title="Doctor Specialties"
        subtitle="Manage medical specialties available on the platform"
        action={
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] transition-colors"
          >
            <Plus size={16} />
            Add New Specialty
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Total Specialties"
          value={specialties.length}
          icon={Stethoscope}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active"
          value={totalActive}
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Disabled"
          value={totalDisabled}
          icon={Ban}
          iconColor="text-red-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {specialties.map((specialty) => (
          <div
            key={specialty.id}
            className="bg-white rounded-[10px] border border-[#E5E5E5] overflow-hidden"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={specialty.image}
                alt={specialty.name}
                className="w-full h-44 object-cover"
              />
              {specialty.status === 'Disabled' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Disabled
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-900">{specialty.name}</h3>
                <StatusBadge status={specialty.status} />
              </div>
              <p className="text-sm text-slate-500 mb-3">{specialty.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                <Activity size={12} />
                {specialty.doctors} doctors
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                <button
                  onClick={() => setEditSpecialty(specialty)}
                  className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#0052a3] font-medium transition-colors"
                >
                  <Edit size={14} />
                  Edit
                </button>

                {specialty.status === 'Active' ? (
                  <button
                    onClick={() => setDisableTarget(specialty)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    <Ban size={14} />
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnable(specialty)}
                    className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    <CheckCircle size={14} />
                    Enable
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddForm && (
        <SpecialtyForm
          onClose={() => setShowAddForm(false)}
          onSave={handleSave}
        />
      )}

      {editSpecialty && (
        <SpecialtyForm
          specialty={editSpecialty}
          onClose={() => setEditSpecialty(null)}
          onSave={handleSave}
        />
      )}

      {disableTarget && (
        <DisableSpecialtyModal
          specialty={disableTarget}
          onClose={() => setDisableTarget(null)}
          onConfirm={handleDisable}
        />
      )}

    </div>
  )
}