import App from './App.svelte';
import './global.css';

// Apply persisted theme before first paint to avoid a flash of the wrong theme
try {
  const saved = localStorage.getItem('dbm-lg-theme');
  document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';
} catch {
  document.documentElement.dataset.theme = 'dark';
}

const app = new App({ target: document.getElementById('app') });

export default app;
