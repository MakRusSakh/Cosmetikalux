import { create } from 'zustand'

interface UIStore {
  isCartOpen: boolean
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleSearch: () => void
  toggleMobileMenu: () => void
}

export const useUIStore = create<UIStore>()((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}))
