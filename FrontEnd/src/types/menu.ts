import type { LucideProps } from 'lucide-react'; // Type-only for props (strips to JS)

export interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<LucideProps>; // Typed as icon component (e.g., Home from lucide-react)
  children?: MenuItem[];
}