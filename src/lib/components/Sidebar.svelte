<script>
  import { activeTab, queuePending } from '../stores/app.js';

  const tabs = [
    { id: 'image', label: 'Image', svg: `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>` },
    { id: 'video', label: 'Video', svg: `<rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>` },
    { id: 'audio', label: 'Audio', svg: `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>` },
    { id: 'youtube', label: 'YouTube', svg: `<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/>` },
  ];
  const queueSvg = `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>`;
</script>

<nav class="sidebar">
  {#each tabs as tab}
    <button
      class="nav-btn"
      class:active={$activeTab === tab.id}
      on:click={() => $activeTab = tab.id}
    >
      <span class="bar"></span>
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7">{@html tab.svg}</svg>
      <span>{tab.label}</span>
    </button>
  {/each}

  <button class="nav-btn queue-btn" class:active={$activeTab === 'queue'} on:click={() => $activeTab = 'queue'}>
    <span class="bar"></span>
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7">{@html queueSvg}</svg>
    <span>Queue</span>
    {#if $queuePending > 0}
      <span class="badge">{$queuePending}</span>
    {/if}
  </button>
</nav>

<style>
  .sidebar {
    width: 252px; flex-shrink: 0;
    padding: 8px 12px 16px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .nav-btn {
    position: relative;
    display: flex; align-items: center; gap: 14px;
    height: 40px; padding: 0 14px;
    border: none; border-radius: 6px;
    cursor: pointer; font-family: inherit;
    font-size: 13.5px; text-align: left;
    background: transparent; color: var(--text2); font-weight: 400;
    transition: background 120ms ease;
  }
  .nav-btn:hover { background: var(--hover); }
  .nav-btn.active { background: var(--layer-hi); color: var(--text); font-weight: 600; }
  .bar {
    position: absolute; left: 0; top: 12px;
    width: 3px; height: 16px; border-radius: 2px;
    background: var(--accent);
    opacity: 0;
    transition: opacity 150ms ease;
  }
  .nav-btn.active .bar { opacity: 1; }
  .queue-btn { margin-top: auto; }
  .badge {
    margin-left: auto;
    background: var(--accent); color: var(--accent-text);
    font-size: 10px; font-weight: 700;
    min-width: 18px; height: 18px; border-radius: 99px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 5px;
  }
</style>
