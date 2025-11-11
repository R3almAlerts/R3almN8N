import React from 'react';
import { MenuItem } from '../types/menu';
interface NavMenuProps {
    items: MenuItem[];
    user?: {
        name: string;
        avatar?: string;
    };
    onSearch?: (query: string) => void;
    loading?: boolean;
}
declare const NavMenu: React.FC<NavMenuProps>;
export default NavMenu;
//# sourceMappingURL=NavMenu.d.ts.map