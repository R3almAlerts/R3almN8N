import React, { Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrentUser, useUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import UserForm from '../components/UserForm';
import { Edit } from 'lucide-react';

// Lazy-load UserCard for perf
const UserCard = lazy(() => import('../components/UserCard'));

// Simple Error Boundary for import/module errors
class ErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('UserProfile Error:', error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { query: currentUserQuery } = useCurrentUser();
  const { updateMutation } = useUsers();
  const [editing, setEditing] = useState(false);

  if (currentUserQuery.isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 border-4 border-primary-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-foreground/60">Loading profile...</p>
        </div>
      </motion.div>
    );
  }

  if (currentUserQuery.isError) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center">
        <p className="text-destructive">Failed to load profile. <button onClick={() => window.location.reload()} className="underline hover:text-primary-400">Retry</button></p>
      </motion.div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id: user!.id, ...data });
      setEditing(false);
    } catch (err: any) {
      console.error('Update failed:', err);
      // Toast or error state in parent
    }
  };

  return (
    <ErrorBoundary fallback={<div className="p-8 text-destructive">Failed to load profile components. Refresh to retry.</div>}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-2xl mx-auto">
        <motion.div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
          {!editing && (
            <motion.button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </motion.button>
          )}
        </motion.div>
        {editing ? (
          <UserForm defaultValues={currentUserQuery.data} onSubmit={handleSubmit} />
        ) : (
          <Suspense fallback={
            <div className="glass rounded-xl p-6 animate-pulse">
              <div className="h-16 w-16 bg-white/10 rounded-full mb-4" />
              <div className="h-6 w-48 bg-white/10 rounded mb-2" />
              <div className="h-4 w-32 bg-white/10 rounded" />
            </div>
          }>
            <UserCard user={currentUserQuery.data!} isCurrent />
          </Suspense>
        )}
      </motion.div>
    </ErrorBoundary>
  );
};

export default UserProfile;