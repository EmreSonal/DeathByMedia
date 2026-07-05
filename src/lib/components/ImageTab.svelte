<script>
  import DropZone from './DropZone.svelte';
  import { addToast, enqueueJobs, uid, dirname, stripExt } from '../stores/app.js';

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
    enqueueJobs(files.map(buildJob), { start: true });
    addToast(`Converting ${files.length} image(s)…`, 'info');
  }

  function addToQueue() {
    if (!files.length) return addToast('No files selected', 'error');
    enqueueJobs(files.map(buildJob));
    addToast(`Added ${files.length} job(s) to queue`, 'info');
  }
</script>

<h1>Image conversion</h1>
<p class="subtitle">Convert between PNG, JPG, WEBP, BMP, TIFF, GIF and ICO.</p>

<DropZone
  bind:files
  variant="list"
  label="Drop images here"
  hint="PNG &middot; JPG &middot; WEBP &middot; BMP &middot; TIFF &middot; GIF &middot; ICO &middot; SVG"
  addLabel="+ Add more"
  filters={[{ name: 'Images', extensions: ['png','jpg','jpeg','webp','bmp','tiff','tif','gif','ico','svg'] }]}
  icon={`<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>`}
/>

{#if files.length > 0}
  <div class="panel">
    <div class="panel-stack">
      <div class="field">
        <label for="i-format">Output Format</label>
        <select id="i-format" bind:value={format}>
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
          <option value="bmp">BMP</option>
          <option value="tiff">TIFF</option>
          <option value="gif">GIF</option>
          <option value="ico">ICO</option>
        </select>
      </div>
      <div class="field">
        <label for="i-quality">Quality <span class="val">{quality}</span></label>
        <input id="i-quality" type="range" min="1" max="100" bind:value={quality}>
      </div>
      <div class="field">
        <label for="i-width">Resize (optional)</label>
        <div class="pair">
          <input id="i-width" type="number" placeholder="Width" bind:value={width} min="1">
          <span class="x">&times;</span>
          <input type="number" placeholder="Height" bind:value={height} min="1">
        </div>
      </div>
      <div class="field">
        <label for="i-outdir">Output Folder</label>
        <div class="folder-row">
          <input id="i-outdir" type="text" value={outputDir} placeholder="Same as source" readonly>
          <button class="btn-browse" on:click={pickDir}>Browse</button>
        </div>
      </div>
    </div>
    <div class="panel-actions">
      <button class="btn-accent" on:click={convert}>
        Convert {files.length} image{files.length === 1 ? '' : 's'}
      </button>
      <button class="btn-glass" on:click={addToQueue}>Add to queue</button>
    </div>
  </div>
{/if}
