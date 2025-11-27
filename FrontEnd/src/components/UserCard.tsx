import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Trash2, Crown } from 'lucide-react';
import { User as UserType } from '../hooks/useUsers';

interface UserCardProps {
  user: UserType;
  onEdit?: (user: UserType) => void;
  onDelete?: (id: string) => void;
  isCurrent?: boolean;
}

const UserCard: React.FC<UserCardProps> = memo(({ user, onEdit, onDelete, isCurrent = false }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-xl p-6 shadow-xl border border-border relative overflow-hidden group"
    whileHover={{ scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    role="article"
    aria-labelledby={`user-${user.id}-name`}
  >
    {/* Avatar Section with Orbit Anim */}
    <div className="flex items-center space-x-4 mb-4" id={`user-${user.id}-name`}>
      <motion.div className="relative" animate={isCurrent ? { rotate: 360 } : {}} transition={isCurrent ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}>
        <img
          src={user.avatar_url || '/default-avatar.png'} // Fallback local asset
          alt={`${user.name}'s avatar`}
          className="h-16 w-16 rounded-full object-cover border-2 border-primary-500/50 shadow-lg"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-avatar.png'; // Graceful fallback
          }}
        />
        {isCurrent && (
          <motion.div
            className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full shadow-md"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="Current user indicator"
            title="This is you"
          />
        )}
      </motion.div>
      <div>
        <h3 className="text-lg font-bold text-foreground truncate" title={user.name}>
          {user.name}
        </h3>
        <p className="text-sm text-muted-foreground truncate" title={user.email}>
          {user.email}
        </p>
      </div>
    </div>

    {/* Role Badge & Actions */}
    <div className="flex justify-between items-center">
      <motion.span 
        className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
          user.role === 'admin' 
            ? 'bg-gradient-to-r from-secondary-500 to-purple-600 text-background' 
            : 'bg-gradient-to-r from-primary-500 to-blue-600 text-background'
        }`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-label={`Role: ${user.role}`}
        title={`Role: ${user.role.toUpperCase()}`}
      >
        {user.role.toUpperCase()}
      </motion.span>
      {(onEdit || onDelete) && (
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" role="group" aria-label="User actions">
          {onEdit && (
            <motion.button
              onClick={() => onEdit(user)}
              className="p-2 text-primary-400 hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 rounded-full transition-colors"
              aria-label={`Edit ${user.name}'s profile`}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="h-4 w-4" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              onClick={() => onDelete?.(user.id)}
              className="p-2 text-destructive hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-full transition-colors"
              aria-label={`Delete ${user.name}`}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      )}
    </div>

    {/* Hover Overlay for Depth */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      aria-hidden
    />
  </motion.div>
));

UserCard.displayName = 'UserCard';

export default UserCard;