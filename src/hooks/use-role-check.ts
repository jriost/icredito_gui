
"use client";

import { useSyncExternalStore } from 'react';

// ============================================================
// STORE LOGIC for useSyncExternalStore
// ============================================================

let isAdmin: boolean | null = null;
const listeners = new Set<() => void>();

const getSnapshot = () => isAdmin;

const emitChange = () => {
  const cookie = typeof window !== 'undefined' 
    ? document.cookie.split('; ').find(row => row.startsWith('user_data='))
    : undefined;

  let newIsAdmin: boolean | null = null;
  if (cookie) {
    const value = cookie.split('=')[1];
    try {
      const userData = JSON.parse(decodeURIComponent(value));
      newIsAdmin = userData.is_admin === true;
    } catch (error) {
      console.error("Failed to parse user data from cookie:", error);
      newIsAdmin = false;
    }
  }
  
  if (newIsAdmin !== isAdmin) {
    isAdmin = newIsAdmin;
    for (const listener of listeners) {
      listener();
    }
  }
};

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  emitChange(); 
  return () => {
    listeners.delete(callback);
  };
};

// ============================================================
// HOOK
// ============================================================

/**
 * Checks if the current user is an administrator based on the 'is_admin' flag 
 * in the user_data cookie, using `useSyncExternalStore` for a stable, 
 * side-effect-free implementation.
 * 
 * @returns {boolean | null} `true` if admin, `false` if not, `null` if the cookie is not present or on the server.
 */
export function useRoleCheck(): boolean | null {
  const role = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => null
  );

  return role;
}
