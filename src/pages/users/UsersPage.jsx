import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  Ban,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import RoleBadge from "@/components/shared/RoleBadge";
import UserDetailsModal from "./components/UserDetailsModal";
import EditUserModal from "./components/EditUserModal";
import SuspendModal from "./components/SuspendModal";
import ActivateModal from "./components/ActivateModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import AddUserModal from "./components/AddUserModal";
import { users as initialUsers } from "@/features/users/data/mockData";
import { Users, UserCheck, Clock, Ban as BanIcon } from "lucide-react";

const TABS = [
  { label: "All", value: "all" },
  { label: "Doctors", value: "Doctor" },
  { label: "Patients", value: "Patient" },
  { label: "Assistants", value: "Assistant" },
  { label: "Admins", value: "Admin" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [suspendUser, setSuspendUser] = useState(null);
  const [activateUser, setActivateUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = users.filter((u) => {
    const matchTab =
      activeTab === "all" ||
      (activeTab === "Admin"
        ? u.role === "Admin" || u.role === "Super Admin"
        : u.role === activeTab);
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    return matchTab && matchSearch;
  });

  const getTabCount = (value) => {
    if (value === "all") return users.length;
    if (value === "Admin")
      return users.filter((u) => u.role === "Admin" || u.role === "Super Admin")
        .length;
    return users.filter((u) => u.role === value).length;
  };

  const handleSaveEdit = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleAddUser = (newUser) => {
    setUsers((prev) => [
      ...prev,
      { ...newUser, id: `U${Date.now()}`, lastLogin: "Never" },
    ]);
  };

  const handleSuspend = (reason) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === suspendUser.id ? { ...u, status: "Suspended" } : u,
      ),
    );
    toast.success(`${suspendUser.name} has been suspended`);
    setSuspendUser(null);
  };

  const handleActivate = (reason) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === activateUser.id ? { ...u, status: "Active" } : u,
      ),
    );
    toast.success(`${activateUser.name} has been activated`);
    setActivateUser(null);
  };

  const handleResetPassword = (method) => {
    toast.success(`Password reset email sent to ${resetUser.email}`);
    setResetUser(null);
  };

  const totalActive = users.filter((u) => u.status === "Active").length;
  const totalPending = users.filter((u) => u.status === "Pending").length;
  const totalSuspended = users.filter((u) => u.status === "Suspended").length;

  return (
    <div className="space-y-7">
      {/* Header */}
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
          value={users.length}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active"
          value={totalActive}
          icon={UserCheck}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Pending"
          value={totalPending}
          icon={Clock}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Suspended"
          value={totalSuspended}
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
              onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => setActiveTab(tab.value)}
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
                  {getTabCount(tab.value)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
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
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#E5E5E5] last:border-0 hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-900">
                    {user.name}
                  </p>
                  {user.subtitle && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {user.subtitle}
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-xs text-slate-400">{user.phone}</p>
                </td>
                <td className="px-4 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {user.lastLogin}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <button
                      onClick={() => setViewUser(user)}
                      className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => setEditUser(user)}
                      className="p-1.5 text-slate-400 hover:text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit size={15} />
                    </button>
                    {/* Reset Password */}
                    <button
                      onClick={() => setResetUser(user)}
                      className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Reset Password"
                    >
                      <RefreshCw size={15} />
                    </button>
                    {/* Suspend / Activate */}
                    {user.status === "Suspended" ? (
                      <button
                        onClick={() => setActivateUser(user)}
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activate Account"
                      >
                        <CheckCircle size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSuspendUser(user)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Suspend Account"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E5E5E5]">
          <span className="text-sm text-slate-500">
            Showing {filtered.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Modals */}
      {viewUser && (
        <UserDetailsModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onEdit={(u) => setEditUser(u)}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSaveEdit}
        />
      )}
      {suspendUser && (
        <SuspendModal
          user={suspendUser}
          onClose={() => setSuspendUser(null)}
          onConfirm={handleSuspend}
        />
      )}
      {activateUser && (
        <ActivateModal
          user={activateUser}
          onClose={() => setActivateUser(null)}
          onConfirm={handleActivate}
        />
      )}
      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
          onConfirm={handleResetPassword}
        />
      )}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  );
}
