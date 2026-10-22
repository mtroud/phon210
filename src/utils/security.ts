/**
 * Security and Access Control for Sayyid al-Shuhada Service Complex Directory
 * العتبة الحسينية المقدسة - قسم مجمع سيد الشهداء الخدمي
 */

const PIN_STORAGE_KEY = 'mogma_admin_pin_hash_v1';
const SESSION_STORAGE_KEY = 'mogma_admin_session_v1';

// Default initial Admin PIN: 1234
const DEFAULT_PIN = '1234';

// Simple hash simulation for client storage
function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

export function getAdminPinHash(): string {
  try {
    const saved = localStorage.getItem(PIN_STORAGE_KEY);
    if (saved) return saved;
  } catch {
    // fallback
  }
  return hashPin(DEFAULT_PIN);
}

export function setAdminPin(newPin: string): boolean {
  if (!newPin || newPin.trim().length < 4) return false;
  try {
    localStorage.setItem(PIN_STORAGE_KEY, hashPin(newPin.trim()));
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPin(enteredPin: string): boolean {
  if (!enteredPin) return false;
  const currentHash = getAdminPinHash();
  return hashPin(enteredPin.trim()) === currentHash;
}

export interface SessionState {
  isAdmin: boolean;
  loginTime: number | null;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function getSessionState(): SessionState {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return { isAdmin: false, loginTime: null };
    const parsed = JSON.parse(raw);
    if (parsed.isAdmin && parsed.loginTime) {
      // Check expiration
      if (Date.now() - parsed.loginTime > SESSION_TIMEOUT_MS) {
        clearAdminSession();
        return { isAdmin: false, loginTime: null };
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return { isAdmin: false, loginTime: null };
}

export function startAdminSession(): void {
  try {
    const state: SessionState = {
      isAdmin: true,
      loginTime: Date.now(),
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
