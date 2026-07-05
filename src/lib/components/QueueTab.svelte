<script>
  import { queue, addToast, startQueue, removeJob, clearQueue } from '../stores/app.js';

  const statusLabels = { pending: 'Pending', running: 'Running', done: 'Completed', error: 'Error' };
  const typeLabels = { image: 'IMG', video: 'VID', audio: 'AUD' };

  function clearAll() {
    clearQueue();
    addToast('Queue cleared', 'info');
  }
</script>

<h1>Batch queue</h1>
<p class="subtitle">Jobs run one after another. Add them from any tab.</p>

{#if $queue.length === 0}
  <div class="empty">
    <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.2">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6" stroke-width="3" stroke-linecap="round"/>
      <line x1="3" y1="12" x2="3.01" y2="12" stroke-width="3" stroke-linecap="round"/>
      <line x1="3" y1="18" x2="3.01" y2="18" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <p>Queue is empty</p>
    <span class="hint">Add jobs from the Image, Video, or Audio tabs</span>
  </div>
{:else}
  <div class="list">
    {#each $queue as job (job.id)}
      <div class="job">
        <div class="tile">{typeLabels[job.type] || '?'}</div>
        <div class="info">
          <div class="name" title={job.displayName}>{job.displayName}</div>
          <div class="detail">{job.detail || `${job.type} → ${(job.format || '').toUpperCase()}`}</div>
        </div>
        <div class="prog">
          <div class="prog-track">
            <div class="prog-fill" style="width:{job.progress}%"></div>
          </div>
        </div>
        <span class="pill {job.status}">{statusLabels[job.status] || job.status}</span>
        <button class="remove" on:click={() => removeJob(job.id)}>&times;</button>
      </div>
    {/each}
  </div>
  <div class="actions">
    <button class="btn-accent" on:click={() => startQueue()}>Start all</button>
    <button class="btn-danger" on:click={clearAll}>Clear queue</button>
  </div>
{/if}

<style>
  .empty {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 70px 20px; text-align: center;
  }
  .empty p { color: var(--text2); font-size: 15px; margin: 0; }
  .hint { color: var(--text3); font-size: 11.5px; }

  .list { display: flex; flex-direction: column; gap: 6px; }
  .job {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px;
    background: var(--layer);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border: 1px solid var(--stroke-hi);
    border-radius: 10px;
  }
  .tile {
    width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, rgba(76,194,255,0.22), rgba(122,90,248,0.22));
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.5px;
  }
  .info { flex: 1; min-width: 0; }
  .name { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .detail { color: var(--text3); font-size: 11.5px; margin-top: 1px; }

  .prog { width: 120px; flex-shrink: 0; }
  .prog-track { height: 4px; background: var(--track); border-radius: 99px; overflow: hidden; }
  .prog-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), #7A5AF8);
    border-radius: 99px;
    transition: width 300ms ease;
  }

  .pill {
    font-size: 11px; font-weight: 600; flex-shrink: 0;
    width: 92px; text-align: center; padding: 4px 0;
    border-radius: 99px;
  }
  .pill.pending { background: var(--track); color: var(--text2); }
  .pill.running { background: rgba(76,194,255,0.18); color: var(--accent); }
  .pill.done { background: rgba(76,220,140,0.16); color: #5fd58f; }
  .pill.error { background: rgba(196,43,28,0.15); color: #ff8a80; }
  :global([data-theme="light"]) .pill.done { color: #1f9a55; }
  :global([data-theme="light"]) .pill.error { color: #c42b1c; }

  .remove {
    width: 26px; height: 26px; flex-shrink: 0;
    border: none; background: transparent;
    color: var(--text3); cursor: pointer;
    border-radius: 6px; font-size: 15px; font-family: inherit;
    display: flex; align-items: center; justify-content: center;
    transition: background var(--transition), color var(--transition);
  }
  .remove:hover { background: rgba(196,43,28,0.15); color: #ff8a80; }
</style>
