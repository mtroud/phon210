import QRCode from 'qrcode';
import { Official, QrTargetMode } from '../types';
import { generateVCardString } from './vcardUtils';

// Public Cloud Run URL that is accessible from ANY mobile phone without Google dev login
export const DEFAULT_PUBLIC_URL = 'https://ais-pre-7orb4bhd76airxemcrgqxg-777095380484.europe-west2.run.app';

const CUSTOM_URL_STORAGE_KEY = 'mogma_custom_public_url';

export function getCustomBaseUrl(): string {
  try {
    const saved = localStorage.getItem(CUSTOM_URL_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  } catch {
    // ignore
  }
  return DEFAULT_PUBLIC_URL;
}

export function setCustomBaseUrl(url: string): void {
  try {
    localStorage.setItem(CUSTOM_URL_STORAGE_KEY, url.trim().replace(/\/+$/, ''));
  } catch {
    // ignore
  }
}

/**
 * Gets the verified public URL that ANY other mobile phone can reach without 403 or network errors.
 */
export function getEffectiveBaseUrl(): string {
  try {
    const saved = localStorage.getItem(CUSTOM_URL_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }

    const hostname = window.location.hostname;
    // CRITICAL: "ais-dev-..." and "localhost" are private developer environments.
    // External phones opening "ais-dev-..." get a network error / 403 Forbidden!
    // Therefore, external phones MUST use the public Shared URL "ais-pre-..."!
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.includes('ais-dev-')
    ) {
      return DEFAULT_PUBLIC_URL;
    }

    return window.location.origin + window.location.pathname.replace(/\/+$/, '');
  } catch {
    return DEFAULT_PUBLIC_URL;
  }
}

/**
 * Builds the exact payload encoded in the QR code.
 */
export function getQrPayload(official: Official, mode: QrTargetMode = 'direct_vcard'): string {
  // 1. Direct vCard: 100% offline, zero network error possible, scans straight into phone contacts
  if (mode === 'direct_vcard') {
    return generateVCardString(official);
  }

  // 2. Direct Call
  if (mode === 'quick_call') {
    const primaryPhone = official.mobilePhones[0]?.number.trim() || '';
    return `tel:${primaryPhone}`;
  }

  // 3. Web Profile URL: Self-contained with essential query parameters
  // so ANY external mobile phone displays the official even if never visited before
  const baseUrl = getEffectiveBaseUrl();
  const cleanBase = baseUrl.replace(/\/+$/, '');

  const params = new URLSearchParams();
  params.set('card', official.id);
  params.set('n', official.fullName);
  params.set('t', official.title);
  params.set('d', official.division);
  if (official.badgeNumber) params.set('b', official.badgeNumber);
  
  // Compact phones string: "label:number,label:number"
  if (official.mobilePhones && official.mobilePhones.length > 0) {
    const phoneStr = official.mobilePhones.map(p => `${p.label || 'محمول'}:${p.number}`).join(';');
    params.set('p', phoneStr);
  }

  // Compact internal extensions: "label:number"
  if (official.internalExtensions && official.internalExtensions.length > 0) {
    const extStr = official.internalExtensions.map(e => `${e.label || 'بدالة'}:${e.number}`).join(';');
    params.set('ext', extStr);
  }

  if (official.radioDevice) params.set('r', official.radioDevice);
  if (official.email) params.set('e', official.email);

  return `${cleanBase}?${params.toString()}`;
}

export interface QrOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Generate high-contrast, easily scannable QR Code as DataURL
 */
export async function generateQrDataUrl(
  official: Official,
  mode: QrTargetMode = 'direct_vcard',
  options: QrOptions = {}
): Promise<string> {
  const payload = getQrPayload(official, mode);
  
  try {
    return await QRCode.toDataURL(payload, {
      width: options.width || 360,
      margin: options.margin !== undefined ? options.margin : 2,
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}
