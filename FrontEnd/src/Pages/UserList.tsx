import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';

const UserList: React.FC = () => {
  const { query, createMutation, deleteMutation } = useUsers();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  if (query.isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12"><div className="glass rounded-xl p-6 animate-pulse h-48" /></div>;

  const filteredUsers = query.data?.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) || [];

  const handleDelete = (id: string) => {
    if (confirm('Delete this user?')) deleteMutation.mutate(id);
  };

  const handleEdit = (user: any) => setEditingUser(user);

  const handleCreateOrUpdate = async (data: any) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ id: editingUser.id, ...data });
      setEditingUser(null);
    } else {
      await createMutation.mutateAsync(data);
      setShowCreate(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold gradient-text">User Management</h1>
        <motion.button
          onClick={() => setShowCreate(true)}
          className="px-6 py-3 bg-secondary-500/20 text-secondary-400 rounded-lg hover:bg-secondary-500/30 transition-all flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </motion.button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border bg-white/5 rounded-md text-foreground focus:ring-2 focus:ring-secondary-500"
        />
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <UserForm onSubmit={handleCreateOrUpdate} isAdmin />
          </motion.div>
        )}
        {editingUser && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <h2 className="text-xl font-semibold mb-4">Edit {editingUser.name}</h2>
            <UserForm defaultValues={editingUser} onSubmit={handleCreateOrUpdate} isAdmin />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </motion.div>
  );
};

export default UserList;