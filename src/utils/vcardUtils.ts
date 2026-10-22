import { Official } from '../types';

/**
 * Generates standard vCard (VCF 3.0) content for an official.
 * Formatted cleanly so mobile phone cameras (iPhone iOS & Android Google Lens/Samsung)
 * immediately recognize it as a contact card with "Add to Contacts" action.
 */
export function generateVCardString(official: Official): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${official.fullName}`,
    `N;CHARSET=UTF-8:;${official.fullName};;;`,
    `ORG;CHARSET=UTF-8:العتبة الحسينية المقدسة - مجمع سيد الشهداء الخدمي`,
    `TITLE;CHARSET=UTF-8:${official.title} - ${official.division}`,
  ];

  // Mobile phones
  official.mobilePhones.forEach((phone, idx) => {
    const rawNum = phone.number.trim();
    if (rawNum) {
      // Standard clean TYPE parameter
      if (phone.isPrimary || idx === 0) {
        lines.push(`TEL;TYPE=CELL,PREF:${rawNum}`);
      } else {
        lines.push(`TEL;TYPE=CELL:${rawNum}`);
      }
    }
  });

  // Internal extension phone
  if (official.internalExtensions && official.internalExtensions.length > 0) {
    official.internalExtensions.forEach((ext) => {
      const extNum = ext.number.trim();
      if (extNum) {
        lines.push(`TEL;TYPE=WORK:${extNum}`);
      }
    });
  }

  // Official Email
  if (official.email && official.email.trim()) {
    lines.push(`EMAIL;TYPE=INTERNET:${official.email.trim()}`);
  }

  // Radio callsign, internal extensions list, badge number in NOTE
  const noteParts: string[] = [];
  if (official.radioDevice) {
    noteParts.push(`جهاز النداء اللاسلكي: ${official.radioDevice}`);
  }
  if (official.internalExtensions && official.internalExtensions.length > 0) {
    const extList = official.internalExtensions.map((e) => `${e.label}: ${e.number}`).join(' | ');
    noteParts.push(`الهواتف الداخلية: ${extList}`);
  }
  if (official.dutyLocation) {
    noteParts.push(`الموقع: ${official.dutyLocation}`);
  }
  if (official.badgeNumber) {
    noteParts.push(`الباجة: ${official.badgeNumber}`);
  }
  if (official.bloodType) {
    noteParts.push(`فصيلة الدم: ${official.bloodType}`);
  }

  if (noteParts.length > 0) {
    lines.push(`NOTE;CHARSET=UTF-8:${noteParts.join(' - ')}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Triggers instant download of official's contact card as .vcf file
 */
export function downloadVCard(official: Official): void {
  const vcardText = generateVCardString(official);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = official.fullName.replace(/\s+/g, '_');
  link.download = `بطاقة_${safeName}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
