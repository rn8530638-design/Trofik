export const CONTACT_DRAFT_EVENT = 'contact-draft-changed';
const STORAGE_KEY = 'trofik-contact-draft';

export function readContactDraft() {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function writeContactDraft(draft) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // The forms remain usable if local storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent(CONTACT_DRAFT_EVENT, { detail: draft }));
}
