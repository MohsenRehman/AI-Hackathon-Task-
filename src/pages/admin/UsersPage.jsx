import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, UserMinus, UserCheck, Shield, Trash2, Mail, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/layout/PageWrapper.jsx';
import ErrorBoundary from '../../components/shared/ErrorBoundary.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import StatusBadge from '../../components/shared/StatusBadge.jsx';
import useUiStore from '../../store/uiStore.js';
import { userApi, userKeys } from '../../api/user.api.js';

const UsersPage = () => {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useUiStore();
  const [filterRole, setFilterRole] = useState('all');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'doctor' });

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const res = await userApi.getUsers();
      return res.data?.data || [];
    },
  });

  // Mutation to create a user
  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User created successfully!');
      closeModal();
      setFormData({ name: '', email: '', password: '', role: 'doctor' });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create user.');
    },
  });

  // Mutation to update user status/details
  const { mutate: updateUser } = useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(`User status updated successfully!`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update user.');
    },
  });

  // Mutation to delete a user
  const { mutate: deleteUser } = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete user.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are mandatory.');
      return;
    }
    createUser(formData);
  };

  const handleStatusToggle = (user) => {
    updateUser({ id: user._id, data: { isActive: !user.isActive } });
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      deleteUser(userId);
    }
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    if (filterRole === 'all') return true;
    return u.role === filterRole;
  });

  const columns = [
    {
      header: 'Name',
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center font-bold font-display uppercase">
            {u.name?.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">{u.name}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{u.role}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      cell: (u) => (
        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          {u.email}
        </span>
      ),
    },
    {
      header: 'Subscription Plan',
      cell: (u) => (
        <span className="text-xs capitalize font-bold text-slate-600">
          {u.subscriptionPlan?.plan || 'Free'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (u) => <StatusBadge status={u.isActive ? 'active' : 'inactive'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (u) => (
        <div className="flex justify-end items-center gap-2">
          {u.role !== 'admin' && (
            <>
              <button
                onClick={() => handleStatusToggle(u)}
                title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  u.isActive 
                    ? 'border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100' 
                    : 'border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {u.isActive ? <UserMinus className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                title="Delete User"
                className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageWrapper title="Clinic Staff Management">
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Top Panel */}
          <div className="flex justify-between items-center bg-white p-4 border border-surface-border rounded-xl shadow-xs">
            <div className="flex gap-2">
              {['all', 'doctor', 'receptionist', 'patient'].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer capitalize ${
                    filterRole === role
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {role === 'all' ? 'All Staff' : `${role}s`}
                </button>
              ))}
            </div>
            <Button onClick={() => openModal('add-user')} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Add Clinic User
            </Button>
          </div>

          {/* User List Table */}
          <div className="card p-0 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredUsers}
              isLoading={isLoading}
              emptyMessage="No clinical staff accounts found."
            />
          </div>
        </div>

        {/* Add User Modal */}
        <Modal id="add-user" title="Register New Clinical Staff">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Dr. Arthur Pendelton"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. doctor@clinic.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 block">System Role</label>
              <select
                className="w-full bg-slate-50/50 border border-surface-border rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="patient">Patient</option>
              </select>
            </div>

            <Button type="submit" isLoading={isCreating} className="w-full mt-4">
              Create User Account
            </Button>
          </form>
        </Modal>
      </ErrorBoundary>
    </PageWrapper>
  );
};

export default UsersPage;
