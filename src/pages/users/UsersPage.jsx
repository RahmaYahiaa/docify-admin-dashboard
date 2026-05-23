import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  Clock,
  Ban as BanIcon,
  SlidersHorizontal,
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
  { label: "All", value: "" },
  { label: "Doctors", value: "doctor" },
  { label: "Patients", value: "patient" },
  { label: "Assistants", value: "assistant" },
  { label: "Admins", value: "admin" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [suspendUser, setSuspendUser] = useState(null);
  const [activateUser, setActivateUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Debounce logic for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    ...(debouncedSearch && { "filter[search]": debouncedSearch }),
    ...(activeTab && { "filter[role]": activeTab }),
    ...(statusFilter && { "filter[status]": statusFilter }),
  };

  const { data, isLoading, isError } = useUsers(queryParams, {
    placeholderData: (previousData) => previousData,
  });
  
  const { data: reasons } = useUserReasons();
  const { mutate: suspend, isPending: suspending } = useSuspendUser();
  const { mutate: activate, isPending: activating } = useActivateUser();
  const { mutate: createDoctor, isPending: creatingDoctor } = useCreateDoctor();
  const { mutate: createAdmin, isPending: creatingAdmin } = useCreateAdmin();
  const { mutate: update, isPending: updating } = useUpdateUser();

  const users = data?.data || [];
  const rawStats = data?.stats || {};
  const meta = data?.meta || {};
  const suspendReasons = reasons?.suspend_reasons || [];
  const activateReasons = reasons?.activate_reasons || [];

  const totalUsers = rawStats.total ?? 0;
  const pendingUsers = rawStats.pending ?? 0;
  const suspendedUsers = rawStats.suspended ?? 0;
  const activeUsers = totalUsers > 0 ? totalUsers - (pendingUsers + suspendedUsers) : (rawStats.active ?? 0);

  const stats = {
    ...rawStats,
    total: totalUsers,
    active: activeUsers,
    pending: pendingUsers,
    suspended: suspendedUsers,
  };

  const handleSuspend = (reason) => {
    suspend(
      { id: suspendUser.id, reason },
      { onSuccess: () => setSuspendUser(null) },
    );
  };

  const handleActivate = (reason) => {
    activate(
      { id: activateUser.id, reason },
      { onSuccess: () => setActivateUser(null) },
    );
  };

  const handleSaveEdit = (userId, payload) => {
    update(
      { id: userId, data: payload },
      { onSuccess: () => setEditUser(null) },
    );
  };

  const handleAddUser = (newUser) => {
    if (newUser.role === "Doctor") {
      const formData = new FormData();
      formData.append("first_name", newUser.first_name || "");
      formData.append("last_name", newUser.last_name || "");
      formData.append("email", newUser.email || "");
      formData.append("phone", newUser.phone || "");
      formData.append("specialization_id", newUser.specialization_id || "");
      if (newUser.certificate instanceof File)
        formData.append("certificate", newUser.certificate);
      createDoctor(formData, { onSuccess: () => setShowAddModal(false) });
    } else if (newUser.role === "Admin") {
      createAdmin(
        {
          first_name: newUser.first_name || "",
          last_name: newUser.last_name || "",
          email: newUser.email || "",
          phone: newUser.phone || "",
          admin_level: newUser.admin_level || "admin",
        },
        { onSuccess: () => setShowAddModal(false) },
      );
    }
  };

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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={UserCheck}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Suspended"
          value={stats.suspended}
          icon={BanIcon}
          iconColor="text-red-500"
        />
      </div>

      <div className="bg-white rounded-[10px] border border-[#E5E5E5] overflow-hidden">
        {/* Search & Filters */}
        <div className="p-4 border-b border-[#E5E5E5] flex gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#E5E5E5] rounded-lg outline-none focus:border-[#0066CC] transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showFilters
                ? "bg-[#0066CC] text-white border-[#0066CC]"
                : "text-slate-700 border-[#E5E5E5] hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-slate-50 border-b border-[#E5E5E5] animate-in slide-in-from-top duration-200">
            <div className="max-w-xs space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 bg-white border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#0066CC]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
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
                className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.value ? "border-[#0066CC] text-[#0066CC]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.value ? "bg-blue-50 text-[#0066CC]" : "bg-slate-100 text-slate-500"}`}
                >
                  {tab.value === ""
                    ? stats.total
                    : (stats[`${tab.value}s_count`] ?? 0)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading && users.length === 0 ? (
            <div className="p-8 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-sm text-red-500">
              Failed to load users
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E5] bg-slate-50/50">
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Last Login</th>
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-[#E5E5E5] hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {user.user?.name || "Unknown User"}
                          </p>
                          {(user.user?.specialty) && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {user.user?.specialty || "General Medicine"}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-600">{user.contact?.email}</p>
                          <p className="text-xs text-slate-400">
                            {user.contact?.phone && user.contact.phone.length > 5 ? user.contact.phone : "01000000000"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {user.last_login || "Never"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setViewUser(user)}
                              className="p-1.5 text-slate-400 hover:text-[#0066CC] rounded-lg transition-colors"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setEditUser(user)}
                              className="p-1.5 text-slate-400 hover:text-[#0066CC] rounded-lg transition-colors"
                            >
                              <Edit size={15} />
                            </button>
                            {user.status === "suspended" ? (
                              <button
                                onClick={() => setActivateUser(user)}
                                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"
                              >
                                <CheckCircle size={15} />
                              </button>
                            ) : (
                              <button
                                onClick={() => setSuspendUser(user)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <Ban size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-[#E5E5E5] flex items-center justify-between bg-slate-50/30">
          <span className="text-sm text-slate-500">
            Showing {users.length} of {meta.total || 0} users
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-[#E5E5E5] rounded-lg disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium tabular-nums">
              {page} / {meta.last_page || 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === meta.last_page}
              className="px-3 py-1.5 text-sm border border-[#E5E5E5] rounded-lg disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewUser && (
        <UserDetailsModal
          user={{
            ...viewUser,
            name: viewUser.user?.name,
            email: viewUser.contact?.email,
            phone: viewUser.contact?.phone,
            lastLogin: viewUser.last_login,
          }}
          onClose={() => setViewUser(null)}
          onEdit={() => {
            setEditUser(viewUser);
            setViewUser(null);
          }}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSaveEdit}
          loading={updating}
        />
      )}
      {suspendUser && (
        <SuspendModal
          user={{
            ...suspendUser,
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
            ...activateUser,
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
          loading={creatingDoctor || creatingAdmin}
        />
      )}
    </div>
  );
}