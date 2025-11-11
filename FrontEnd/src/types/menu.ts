import type { LucideProps } from 'lucide-react';

export interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<LucideProps>;
  children?: MenuItem[];
}