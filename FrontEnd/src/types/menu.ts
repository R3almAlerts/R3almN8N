export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
  icon?: React.ComponentType<{ className?: string }>; // Optional for icons
}