// Inside MenuItemComponent, replace the <button> with <Link>
import { Link, useLocation } from 'react-router-dom';

// ...

const MenuItemComponent = memo(({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.label);
  const Icon = item.icon;
  const isActive = item.href && location.pathname === item.href;

  return (
    <div className={clsx({ 'ml-4': depth > 0 })}>
      <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpand(item.label)}
            className={clsx(
              'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
              'hover:bg-white/10 backdrop-blur-sm',
              depth === 0 ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-100 text-sm',
              !isCollapsed && 'pr-3'
            )}
          >
            {/* ... icon + label ... */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon className={clsx('flex-shrink-0', depth === 0 ? 'w-5 h-5' : 'w-4 h-4', isCollapsed && depth === 0 && 'w-6 h-6')} />
              {!isCollapsed && <span className="truncate font-medium">{item.label}</span>}
            </div>
            {!isCollapsed && (
              <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </motion.div>
            )}
          </button>
        ) : (
          <Link
            to={item.href!}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              isActive ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10',
              depth > 0 && 'text-sm text-gray-400 hover:text-gray-100'
            )}
          >
            <Icon className={clsx('flex-shrink-0', depth === 0 ? 'w-5 h-5' : 'w-4 h-4')} />
            {!isCollapsed && <span className="truncate font-medium">{item.label}</span>}
          </Link>
        )}
      </motion.div>

      {/* Submenu */}
      <AnimatePresence>
        {hasChildren && isExpanded && !isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => (
                <MenuItemComponent key={child.label} item={child} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});