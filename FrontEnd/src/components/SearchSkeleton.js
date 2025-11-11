import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { motion } from 'framer-motion';
const SearchSkeleton = () => (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex space-x-2", children: [...Array(3)].map((_, i) => (_jsx("div", { className: "w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" }, i))) }));
export default SearchSkeleton;
//# sourceMappingURL=SearchSkeleton.js.map