<script>
  import { toasts } from '../stores/app.js';
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div class="toast" class:error={toast.type === 'error'}>
      {toast.msg}
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed; bottom: 24px; right: 24px;
    display: flex; flex-direction: column-reverse; gap: 8px;
    z-index: 999; pointer-events: none;
  }
  .toast {
    padding: 11px 18px; border-radius: 10px;
    font-size: 13px; font-weight: 500; max-width: 340px;
    background: var(--toast-bg);
    backdrop-filter: blur(30px) saturate(170%);
    -webkit-backdrop-filter: blur(30px) saturate(170%);
    border: 1px solid var(--stroke-hi);
    box-shadow: 0 8px 28px rgba(0,0,0,0.25);
    color: var(--text);
    pointer-events: auto;
    animation: slideIn 200ms ease;
  }
  .toast.error { color: #ff8a80; }
  :global([data-theme="light"]) .toast.error { color: #c42b1c; }

  @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
