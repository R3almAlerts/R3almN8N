import React from 'react';
import { motion } from 'framer-motion';

const SearchSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex space-x-2"
  >
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    ))}
  </motion.div>
);

export default SearchSkeleton;