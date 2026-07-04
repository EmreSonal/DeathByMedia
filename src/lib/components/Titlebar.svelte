<script>
  import logo from '../../../assets/icon.png';
  import { theme, toggleTheme } from '../stores/app.js';
  const api = window.api || {};
</script>

<header class="titlebar">
  <div class="brand">
    <div class="icon-tile">
      <img src={logo} width="13" height="13" alt="" />
    </div>
    <span class="title">Death By Media</span>
  </div>
  <div class="controls">
    <button class="theme-btn" on:click={toggleTheme} title="Toggle theme">
      {#if $theme === 'dark'}
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
      {:else}
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
      {/if}
    </button>
    <button class="win-btn" on:click={() => api.minimize?.()} title="Minimize">
      <svg viewBox="0 0 12 12" width="10" height="10"><rect y="5.6" width="12" height="1" fill="currentColor"/></svg>
    </button>
    <button class="win-btn" on:click={() => api.maximize?.()} title="Maximize">
      <svg viewBox="0 0 12 12" width="10" height="10"><rect x="1.5" y="1.5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1"/></svg>
    </button>
    <button class="win-btn close" on:click={() => api.close?.()} title="Close">
      <svg viewBox="0 0 12 12" width="10" height="10"><line x1="1.5" y1="1.5" x2="10.5" y2="10.5" stroke="currentColor" stroke-width="1"/><line x1="10.5" y1="1.5" x2="1.5" y2="10.5" stroke="currentColor" stroke-width="1"/></svg>
    </button>
  </div>
</header>

<style>
  .titlebar {
    height: 44px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between;
    padding-left: 16px;
    -webkit-app-region: drag; user-select: none;
  }
  .brand { display: flex; align-items: center; gap: 10px; }
  .icon-tile {
    width: 22px; height: 22px; border-radius: 6px;
    background: linear-gradient(135deg, var(--accent), #7A5AF8);
    display: flex; align-items: center; justify-content: center;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
  }
  .icon-tile img { display: block; filter: brightness(10); }
  .title { font-size: 12px; font-weight: 600; color: var(--text2); }

  .controls { display: flex; align-items: center; height: 100%; -webkit-app-region: no-drag; }
  .theme-btn {
    width: 40px; height: 30px; margin-right: 6px;
    border: 1px solid var(--stroke);
    background: var(--layer);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 99px;
    color: var(--text2); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 0;
    transition: background var(--transition), color var(--transition);
  }
  .theme-btn:hover { background: var(--hover); color: var(--text); }
  .theme-btn svg { display: block; }

  .win-btn {
    width: 46px; height: 44px;
    border: none; background: transparent;
    color: var(--text2); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background var(--transition), color var(--transition);
  }
  .win-btn:hover { background: var(--hover); }
  .close:hover { background: #c42b1c; color: #ffffff; }
</style>
