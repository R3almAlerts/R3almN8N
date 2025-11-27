import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrentUser, useUsers } from '../hooks/useUsers';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const { query: currentUserQuery } = useCurrentUser();
  const { updateMutation } = useUsers();
  const [editing, setEditing] = useState(false);

  if (currentUserQuery.isLoading) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary-400 border-t-transparent rounded-full" /></div>;

  const user = currentUserQuery.data!;

  const handleSubmit = async (data: any) => {
    await updateMutation.mutateAsync({ id: user.id, ...data });
    setEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
      {editing ? (
        <UserForm defaultValues={user} onSubmit={handleSubmit} />
      ) : (
        <>
          <UserCard user={user} isCurrent />
          <motion.button
            onClick={() => setEditing(true)}
            className="px-6 py-3 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-all flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default UserProfile;