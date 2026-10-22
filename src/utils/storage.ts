import { Official } from '../types';
import { INITIAL_OFFICIALS } from '../data/initialOfficials';

const STORAGE_KEY = 'mogma_shuhada_officials_v1';

export function loadOfficials(): Official[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveOfficials(INITIAL_OFFICIALS);
      return INITIAL_OFFICIALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_OFFICIALS;
  } catch (e) {
    console.error('Failed to load officials from localStorage:', e);
    return INITIAL_OFFICIALS;
  }
}

export function saveOfficials(officials: Official[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(officials));
  } catch (e) {
    console.error('Failed to save officials to localStorage:', e);
  }
}

export function resetOfficialsToDefault(): Official[] {
  saveOfficials(INITIAL_OFFICIALS);
  return INITIAL_OFFICIALS;
}

export function exportOfficialsJson(officials: Official[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(officials, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `دليل_مسؤولي_مجمع_سيد_الشهداء_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
