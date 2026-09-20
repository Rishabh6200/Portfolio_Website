"use client";

import { useEffect, useSyncExternalStore } from "react";

let sidebarState = false;
const listeners = new Set<() => void>();

function emitChange() {
   for (const listener of listeners) {
      listener();
   }
}

export function getIsSidebarOpen(): boolean {
   if (typeof window === "undefined") return false;
   return sidebarState;
}

export function setSidebarOpen(open: boolean) {
   sidebarState = open;
   if (typeof window !== "undefined") {
      try {
         localStorage.setItem("sidebarOpen", String(open));
      } catch {}
   }
   emitChange();
}

export const toggleSidebar = () => {
   setSidebarOpen(!sidebarState);
};

export function closeSidebar() {
   setSidebarOpen(false);
}

export function useSidebar() {
   const isOpen = useSyncExternalStore(
      (onStoreChange) => {
         listeners.add(onStoreChange);
         return () => {
            listeners.delete(onStoreChange);
         };
      },
      () => sidebarState,
      () => false
   );

   useEffect(() => {
      try {
         const stored = localStorage.getItem("sidebarOpen");
         if (stored !== null) {
            sidebarState = stored === "true";
            emitChange();
         }
      } catch {}
   }, []);

   return {
      isOpen,
      toggle: toggleSidebar,
      close: closeSidebar,
      setOpen: setSidebarOpen,
   };
}
