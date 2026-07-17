import { createContext, useContext } from "react";

/**
 * Tracks which nav section is currently in view (set by the scroll-spy in
 * App). Navbar reads it for the highlight; Section reads it to fade its
 * glow in only for the active section. Default "hero" (top of page).
 */
export const ActiveSectionContext = createContext<string>("hero");

export const useActiveSection = () => useContext(ActiveSectionContext);
