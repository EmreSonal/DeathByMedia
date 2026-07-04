<script>
  import { basename } from '../stores/app.js';
  export let files = [];
  export let label = 'Drop files here';
  export let hint = '';
  export let filters = [];
  export let icon = `<rect x="3" y="3" width="18" height="18" rx="2"/>`;
  export let variant = 'zone'; // 'zone' | 'chips'
  export let addLabel = '+ Add files';

  let dragging = false;
  let dragDepth = 0;

  async function browse() {
    const api = window.api;
    if (!api) return;
    const paths = await api.openFiles({ filters });
    if (paths.length) addFiles(paths);
  }

  function addFiles(paths) {
    const existing = new Set(files.map(f => f.path));
    const newFiles = paths.filter(p => !existing.has(p)).map(p => ({ path: p, name: basename(p) }));
    files = [...files, ...newFiles];
  }

  function removeFile(idx) {
    files = files.filter((_, i) => i !== idx);
  }

  function hasFilePayload(dataTransfer) {
    return Array.from(dataTransfer?.types || []).includes('Files');
  }

  function getDroppedPaths(dataTransfer) {
    const files = [
      ...Array.from(dataTransfer?.items || [])
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile?.())
        .filter(Boolean),
      // fallback: dataTransfer.files if items gave nothing
      ...(Array.from(dataTransfer?.items || []).filter(i => i.kind === 'file').length === 0
        ? Array.from(dataTransfer?.files || [])
        : []),
    ];

    return files
      .map(file => {
        // Electron 28+ preferred API via preload
        if (window.api?.getFilePath) {
          try { return window.api.getFilePath(file); } catch {}
        }
        // fallback for older Electron or dev browser
        return file.path || '';
      })
      .filter(Boolean);
  }

  function onDragEnter(e) {
    if (!hasFilePayload(e.dataTransfer)) return;
    e.preventDefault();
    dragDepth += 1;
    dragging = true;
  }

  function onDragOver(e) {
    if (!hasFilePayload(e.dataTransfer)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    dragging = true;
  }

  function onDragLeave(e) {
    if (!hasFilePayload(e.dataTransfer)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dragging = false;
  }

  function onDrop(e) {
    if (!hasFilePayload(e.dataTransfer)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth = 0;
    dragging = false;
    addFiles(getDroppedPaths(e.dataTransfer));
  }
</script>

<div
  class="drop-shell"
  class:dragging
  role="presentation"
  on:dragenter={onDragEnter}
  on:dragover={onDragOver}
  on:dragleave={onDragLeave}
  on:drop={onDrop}
>
  {#if variant === 'zone'}
    <div
      class="dropzone"
      on:click={browse}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && browse()}
    >
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.3">{@html icon}</svg>
      <p>{label}, or <span class="browse">browse files</span></p>
      {#if hint}<span class="hint">{hint}</span>{/if}
    </div>
    {#if files.length > 0}
      <div class="chips-row chips-below">
        {#each files as file, idx}
          <span class="chip">
            <span class="chip-name" title={file.path}>{file.name}</span>
            <button class="chip-x" on:click={() => removeFile(idx)}>&times;</button>
          </span>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="chips-row">
      {#each files as file, idx}
        <span class="chip">
          <span class="chip-name" title={file.path}>{file.name}</span>
          <button class="chip-x" on:click={() => removeFile(idx)}>&times;</button>
        </span>
      {/each}
      <button class="add-pill" on:click={browse}>{addLabel}</button>
    </div>
  {/if}
</div>

<style>
  .drop-shell { position: relative; }
  .dropzone {
    border: 1.5px dashed var(--input-b);
    background: var(--layer);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-radius: 12px;
    padding: 34px 20px;
    text-align: center; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    transition: background 120ms ease;
  }
  .dropzone:hover, .drop-shell.dragging .dropzone { background: var(--layer-hi); }
  .dropzone p { margin: 0; font-size: 14px; color: var(--text2); }
  .browse { color: var(--accent); font-weight: 600; }
  .hint { font-size: 11.5px; color: var(--text3); }

  .chips-below { margin-top: 12px; }
  .drop-shell.dragging .chips-row:not(.chips-below) {
    outline: 1.5px dashed var(--input-b);
    outline-offset: 6px;
    border-radius: 8px;
  }
</style>
