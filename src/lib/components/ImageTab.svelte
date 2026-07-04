<script>
  import DropZone from './DropZone.svelte';
  import { queue, addToast, uid, dirname, stripExt } from '../stores/app.js';

  let files = [];
  let format = 'png';
  let quality = 90;
  let width = '';
  let height = '';
  let outputDir = '';

  async function pickDir() {
    const dir = await window.api?.openFolder();
    if (dir) outputDir = dir;
  }

  function buildJob(file) {
    const outDir = outputDir || dirname(file.path);
    const outName = stripExt(file.name) + '.' + format;
    return {
      id: uid(), type: 'image', input: file.path,
      output: outDir + '/' + outName, format, quality,
      resize: (width || height) ? { width: width ? parseInt(width) : null, height: height ? parseInt(height) : null } : null,
      displayName: file.name, outputName: outName,
      detail: `Image → ${format.toUpperCase()} · quality ${quality}`,
    };
  }

  function convert() {
    if (!files.length) return addToast('No files selected', 'error');
    files.forEach(file => window.api?.startConvert(buildJob(file)));
    addToast(`Converting ${files.length} image(s)…`, 'info');
  }

  function addToQueue() {
    if (!files.length) return addToast('No files selected', 'error');
    const jobs = files.map(f => ({ ...buildJob(f), status: 'pending', progress: 0 }));
    queue.update(q => [...q, ...jobs]);
    addToast(`Added ${jobs.length} job(s) to queue`, 'info');
  }
</script>

<h1>Image conversion</h1>
<p class="subtitle">Convert between PNG, JPG, WEBP, BMP, TIFF, GIF and ICO.</p>

<DropZone
  bind:files
  label="Drop images here"
  hint="PNG &middot; JPG &middot; WEBP &middot; BMP &middot; TIFF &middot; GIF &middot; ICO &middot; SVG"
  filters={[{ name: 'Images', extensions: ['png','jpg','jpeg','webp','bmp','tiff','tif','gif','ico','svg'] }]}
  icon={`<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>`}
/>

<div class="rows settings">
  <div class="glass-row">
    <div>
      <div class="row-label">Output format</div>
      <div class="row-hint">Target file type for every image</div>
    </div>
    <div class="select-wrap">
      <select bind:value={format}>
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
        <option value="webp">WEBP</option>
        <option value="bmp">BMP</option>
        <option value="tiff">TIFF</option>
        <option value="gif">GIF</option>
        <option value="ico">ICO</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div>
      <div class="row-label">Quality</div>
      <div class="row-hint">Higher looks better, larger files</div>
    </div>
    <div class="slider-group">
      <input type="range" min="1" max="100" bind:value={quality}>
      <span class="slider-val">{quality}</span>
    </div>
  </div>
  <div class="glass-row">
    <div>
      <div class="row-label">Resize</div>
      <div class="row-hint">Optional &mdash; leave blank to keep original</div>
    </div>
    <div class="resize-group">
      <input type="number" placeholder="Width" bind:value={width} min="1">
      <span class="x">&times;</span>
      <input type="number" placeholder="Height" bind:value={height} min="1">
    </div>
  </div>
  <div class="glass-row">
    <div>
      <div class="row-label">Output folder</div>
      <div class="row-hint">Where converted files are saved</div>
    </div>
    <div class="folder-group">
      <input type="text" value={outputDir} placeholder="Same as source" readonly>
      <button class="btn-browse" on:click={pickDir}>Browse</button>
    </div>
  </div>
</div>

<div class="actions">
  <button class="btn-accent" on:click={convert}>
    {files.length ? `Convert ${files.length} image${files.length === 1 ? '' : 's'}` : 'Convert images'}
  </button>
  <button class="btn-glass" on:click={addToQueue}>Add to queue</button>
</div>

<style>
  .settings { margin-top: 20px; }
  .resize-group { display: flex; align-items: center; gap: 8px; }
  .resize-group input { width: 96px; }
  .x { color: var(--text3); }
</style>
