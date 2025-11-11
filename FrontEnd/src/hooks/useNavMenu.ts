import { useState, useCallback } from 'react';

export const useNavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggleMenu, closeMenu };
};