import { writable, derived } from 'svelte/store';

export const activeTab = writable('image');
export const queue = writable([]);
export const toasts = writable([]);

const savedTheme = (() => {
  try { return localStorage.getItem('dbm-lg-theme'); } catch { return null; }
})();
export const theme = writable(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark');
theme.subscribe(t => {
  try { localStorage.setItem('dbm-lg-theme', t); } catch {}
});

export function toggleTheme() {
  theme.update(t => (t === 'dark' ? 'light' : 'dark'));
}

export const queuePending = derived(queue, $q => $q.filter(j => j.status === 'pending' || j.status === 'running').length);

let toastId = 0;
export function addToast(msg, type = 'info') {
  const id = ++toastId;
  toasts.update(t => [...t, { id, msg, type }]);
  setTimeout(() => toasts.update(t => t.filter(x => x.id !== id)), 2600);
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function basename(fp) {
  return fp.replace(/\\/g, '/').split('/').pop();
}

export function dirname(fp) {
  const parts = fp.replace(/\\/g, '/').split('/');
  parts.pop();
  return parts.join('/');
}

export function stripExt(name) {
  return name.replace(/\.[^.]+$/, '');
}

export const audioCodecMap = {
  mp3: 'libmp3lame', flac: 'flac', wav: 'pcm_s16le', aac: 'aac', ogg: 'libvorbis', m4a: 'aac',
};
