import { useState } from "react";
import { Plus, Edit, Ban, CheckCircle, Activity } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import DisableSpecialtyModal from "./components/DisableSpecialtyModal";
import SpecialtyForm from "./components/SpecialtyForm";
import { Stethoscope } from "lucide-react";
import { toast } from "sonner";
import {
  useSpecialties,
  useCreateSpecialty,
  useUpdateSpecialty,
  useActivateSpecialty,
  useDisableSpecialty,
} from "@/hooks/useSpecialties";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export default function SpecialtiesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSpecialty, setEditSpecialty] = useState(null);
  const [disableTarget, setDisableTarget] = useState(null);

  const { data, isLoading, isError } = useSpecialties();
  const { mutate: createSpecialty, isPending: creating } = useCreateSpecialty();
  const { mutate: updateSpecialty, isPending: updating } = useUpdateSpecialty();
  const { mutate: activateSpecialty } = useActivateSpecialty();
  const { mutate: disableSpecialty } = useDisableSpecialty();

  const specialties = data?.specialties || [];
  const stats = data?.stats || {};

  // Handles absolute and relative paths
  const getImageUrl = (url) => {
    if (!url) return "/images/default-specialization.png";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  const handleSave = (form) => {
    const formData = new FormData();

    if (form.name?.trim()) {
      formData.append("name", form.name.trim());
    }

    if (form.description?.trim()) {
      formData.append("description", form.description.trim());
    }

    if (form.image instanceof File) {
      formData.append("icon_url", form.image);
    }

    if (editSpecialty) {
      updateSpecialty(
        {
          id: editSpecialty.id,
          data: formData,
        },
        {
          onSuccess: () => {
            toast.success("Specialty updated successfully!");
            setEditSpecialty(null);
          },

          onError: (err) => {
            const msg =
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              Object.values(err?.response?.data?.errors || {})[0]?.[0] ||
              "Failed to update specialty";

            toast.error(msg);
          },
        },
      );
    } else {
      // CREATE
      if (!(form.image instanceof File)) {
        toast.error("Please upload specialty image");
        return;
      }

      createSpecialty(formData, {
        onSuccess: () => {
          toast.success("Specialty created successfully!");
          setShowAddForm(false);
        },

        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            Object.values(err?.response?.data?.errors || {})[0]?.[0] ||
            "Failed to create specialty";

          toast.error(msg);
        },
      });
    }
  };

  const handleDisable = () => {
    disableSpecialty(disableTarget.id, {
      onSuccess: () => setDisableTarget(null),
    });
  };

  const handleEnable = (item) => {
    activateSpecialty(item.id, {
      onSuccess: () => {
        toast.success("Specialty enabled");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Doctor Specialties"
          subtitle="Manage medical specialties available on the platform"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[10px] border border-[#E5E5E5] h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Failed to load specialties</p>
      </div>
    );
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
      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] transition-colors shrink-0"
    >
      <Plus size={16} />
      Add New Specialty
    </button>
  }
/>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Specialties"
          value={stats.total ?? 0}
          icon={Stethoscope}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active"
          value={stats.active ?? 0}
          icon={CheckCircle}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Disabled"
          value={stats.disabled ?? 0}
          icon={Ban}
          iconColor="text-red-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[10px] border border-[#E5E5E5] overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={getImageUrl(item.icon_url)}
                alt={item.name}
                className="w-full h-44 object-cover bg-slate-100"
                onError={(e) => {
                  e.target.src = "/images/default-specialization.png";
                }}
              />
              {item.status === "disabled" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Disabled
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-900">{item.name}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                {item.description || "No description provided"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                <Activity size={12} />
                {item.doctors_count} doctors
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                <button
                  onClick={() => setEditSpecialty(item)}
                  className="flex items-center gap-1.5 text-sm text-[#0066CC] hover:text-[#0052a3] font-medium transition-colors"
                >
                  <Edit size={14} />
                  Edit
                </button>

                {item.status === "active" ? (
                  <button
                    onClick={() => setDisableTarget(item)}
                    className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    <Ban size={14} />
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnable(item)}
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

      {/* Add Modal */}
      {showAddForm && (
        <SpecialtyForm
          onClose={() => setShowAddForm(false)}
          onSave={handleSave}
          loading={creating}
        />
      )}

      {/* Edit Modal */}
      {editSpecialty && (
        <SpecialtyForm
          specialty={{
            name: editSpecialty.name,
            description: editSpecialty.description || "",
            image: getImageUrl(editSpecialty.icon_url),
          }}
          onClose={() => setEditSpecialty(null)}
          onSave={handleSave}
          loading={updating}
        />
      )}

      {/* Disable Confirm Modal */}
      {disableTarget && (
        <DisableSpecialtyModal
          specialty={{ name: disableTarget.name }}
          onClose={() => setDisableTarget(null)}
          onConfirm={handleDisable}
        />
      )}
    </div>
  );
}