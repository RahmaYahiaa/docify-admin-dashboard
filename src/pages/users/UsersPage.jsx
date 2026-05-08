import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import RoleBadge from "@/components/shared/RoleBadge";
import UserDetailsModal from "./components/UserDetailsModal";
import EditUserModal from "./components/EditUserModal";
import SuspendModal from "./components/SuspendModal";
import ActivateModal from "./components/ActivateModal";
import AddUserModal from "./components/AddUserModal";
import { Users, UserCheck, Clock, Ban as BanIcon } from "lucide-react";
import {
  useUsers,
  useUserReasons,
  useSuspendUser,
  useActivateUser,
  useCreateDoctor,
  useCreateAdmin,
  useUpdateUser,
} from "@/hooks/useUsers";

const TABS = [
  { label: "All", value: "", countKey: "total" },
  { label: "Doctors", value: "doctor", countKey: "doctors_count" },
  { label: "Patients", value: "patient", countKey: "patients_count" },
  { label: "Assistants", value: "assistant", countKey: "assistants_count" },
  { label: "Admins", value: "admin", countKey: "admins_count" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [suspendUser, setSuspendUser] = useState(null);
  const [activateUser, setActivateUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading, isError } = useUsers({
    ...(search && { "filter[first_name]": search }),
    ...(activeTab && { "filter[role]": activeTab }),
    page,
  });

  const { data: reasons } = useUserReasons();
  const { mutate: suspend, isPending: suspending } = useSuspendUser();
  const { mutate: activate, isPending: activating } = useActivateUser();
  const { mutate: createDoctor, isPending: creatingDoc } = useCreateDoctor();
  const { mutate: createAdmin, isPending: creatingAdm } = useCreateAdmin();
  const { mutate: updateUser, isPending: updating } = useUpdateUser();

  const users = data?.data || [];
  const stats = data?.stats || {};
  const meta = data?.meta || {};
  const suspendReasons = reasons?.suspend_reasons || [];
  const activateReasons = reasons?.activate_reasons || [];

  const handleSuspend = (reason) =>
    suspend(
      { id: suspendUser.id, reason },
      { onSuccess: () => setSuspendUser(null) },
    );

  const handleActivate = (reason) =>
    activate(
      { id: activateUser.id, reason },
      { onSuccess: () => setActivateUser(null) },
    );

  const handleSaveEdit = ({ id, data }) =>
    updateUser({ id, data }, { onSuccess: () => setEditUser(null) });

  const handleAddUser = (newUser) => {
    if (newUser.role === "Doctor") {
      const formData = new FormData();
      formData.append("first_name", newUser.first_name);
      formData.append("last_name", newUser.last_name || "");
      formData.append("email", newUser.email);
      formData.append("phone", newUser.phone || "");
      formData.append("specialization_id", newUser.specialization_id);
      if (newUser.certificate)
        formData.append("certificate", newUser.certificate);
      createDoctor(formData, { onSuccess: () => setShowAddModal(false) });
    } else if (newUser.role === "Admin") {
      createAdmin(
        {
          first_name: newUser.first_name,
          last_name: newUser.last_name || "",
          email: newUser.email,
          phone: newUser.phone || "",
          admin_level: newUser.admin_level, // "admin" | "super admin"
        },
        { onSuccess: () => setShowAddModal(false) },
      );
    }
  };

  const mapToModalUser = (row) => ({
    id: row.id,
    name: row.user?.name,
    email: row.contact?.email,
    phone: row.contact?.phone,
    role: row.role,
    status: row.status,
    specialty: row.user?.specialty,
    lastLogin: row.last_login,
    accountCreated: row.created_at,
    createdBy: row.created_by,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        subtitle="Manage all platform users, roles, and permissions"
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0066CC] rounded-lg hover:bg-[#0052a3] transition-colors"
          >
            <Plus size={16} />
            Add New User
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={isLoading ? "—" : (stats.total ?? 0)}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active"
          value={isLoading ? "—" : (stats.active ?? 0)}
          icon={UserCheck}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Pending"
          value={isLoading ? "—" : (stats.pending ?? 0)}
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Suspended"
          value={isLoading ? "—" : (stats.suspended ?? 0)}
          icon={BanIcon}
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
              placeholder="Search by name, email, or phone..."
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
          <div className="flex gap-6 overflow-x-auto">
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
                {tab.label}
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value
                      ? "bg-blue-50 text-[#0066CC]"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {stats[tab.countKey] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-slate-50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-red-500">
            Failed to load users
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {[
                  "USER",
                  "CONTACT",
                  "ROLE",
                  "STATUS",
                  "LAST LOGIN",
                  "ACTIONS",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {row.user?.name}
                      </p>
                      {row.user?.specialty && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {row.user.specialty}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-600">
                        {row.contact?.email}
                      </p>
                      <p className="text-xs text-slate-400">
                        {row.contact?.phone || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <RoleBadge role={row.role} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.last_login}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewUser(row)}
                          className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setEditUser(row)}
                          className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit size={15} />
                        </button>
                        {/* Reset password icon removed — credentials are sent via email on creation */}
                        {row.status === "suspended" ? (
                          <button
                            onClick={() => setActivateUser(row)}
                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Activate Account"
                          >
                            <CheckCircle size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setSuspendUser(row)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Suspend Account"
                          >
                            <Ban size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#E5E5E5] flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing {users.length} of {meta.total || 0} users
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm text-slate-600 tabular-nums">
              {page} / {meta.last_page || 1}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === meta.last_page}
              className="px-3 py-1.5 text-sm border border-[#E5E5E5] rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}

      {viewUser && (
        <UserDetailsModal
          user={mapToModalUser(viewUser)}
          onClose={() => setViewUser(null)}
          onEdit={() => {
            setEditUser(viewUser);
            setViewUser(null);
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          user={mapToModalUser(editUser)}
          onClose={() => setEditUser(null)}
          onSave={handleSaveEdit}
          loading={updating}
        />
      )}

      {suspendUser && (
        <SuspendModal
          user={{
            id: suspendUser.id,
            name: suspendUser.user?.name,
            role: suspendUser.role,
          }}
          reasons={suspendReasons}
          onClose={() => setSuspendUser(null)}
          onConfirm={handleSuspend}
          loading={suspending}
        />
      )}

      {activateUser && (
        <ActivateModal
          user={{
            id: activateUser.id,
            name: activateUser.user?.name,
            role: activateUser.role,
          }}
          reasons={activateReasons}
          onClose={() => setActivateUser(null)}
          onConfirm={handleActivate}
          loading={activating}
        />
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
          loading={creatingDoc || creatingAdm}
        />
      )}
    </div>
  );
}
