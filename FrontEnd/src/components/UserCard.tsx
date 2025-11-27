import React from 'react';
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
    className="glass rounded-xl p-6 shadow-xl border border-border relative overflow-hidden"
    whileHover={{ scale: 1.02 }}
  >
    {/* Avatar with orbit anim if current */}
    <div className="flex items-center space-x-4 mb-4">
      <motion.div
        className="relative"
        animate={isCurrent ? { rotate: 360 } : {}}
        transition={isCurrent ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
      >
        <img
          src={user.avatar_url || '/default-avatar.png'}
          alt={`${user.name}'s avatar`}
          className="h-16 w-16 rounded-full object-cover border-2 border-primary-500"
        />
        {isCurrent && <Crown className="absolute -top-1 -right-1 h-5 w-5 text-secondary-400 animate-pulse" />}
      </motion.div>
      <div>
        <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        user.role === 'admin' ? 'bg-secondary-500/20 text-secondary-400' : 'bg-primary-500/20 text-primary-400'
      }`}>
        {user.role}
      </span>
      {(onEdit || onDelete) && (
        <div className="flex space-x-2">
          {onEdit && (
            <motion.button onClick={() => onEdit(user)} className="p-2 text-primary-400 hover:text-primary-500" aria-label="Edit user">
              <Edit className="h-4 w-4" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button onClick={() => onDelete?.(user.id)} className="p-2 text-destructive hover:text-red-500" aria-label="Delete user">
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      )}
    </div>
  </motion.div>
));

UserCard.displayName = 'UserCard';

export default UserCard;