<script>
  import DropZone from './DropZone.svelte';
  import { queue, addToast, uid, dirname, stripExt } from '../stores/app.js';

  let files = [];
  let format = 'mp4';
  let codec = 'libx264';
  let acodec = 'aac';
  let preset = 'medium';
  let crf = 23;
  let resolution = '';
  let fps = '';
  let abitrate = '192k';
  let outputDir = '';

  const codecLabels = { libx264: 'H.264', libx265: 'H.265', 'libvpx-vp9': 'VP9', copy: 'Copy' };

  async function pickDir() {
    const dir = await window.api?.openFolder();
    if (dir) outputDir = dir;
  }

  function buildJob(file) {
    const outDir = outputDir || dirname(file.path);
    const outName = stripExt(file.name) + '_converted.' + format;
    return {
      id: uid(), type: 'video', input: file.path, output: outDir + '/' + outName,
      format, codec, audioCodec: acodec, preset, crf,
      resolution: resolution || null, fps: fps || null, audioBitrate: abitrate,
      displayName: file.name, outputName: outName,
      detail: `Video → ${format.toUpperCase()} · ${codecLabels[codec] || codec} · CRF ${crf}`,
    };
  }

  function convert() {
    if (!files.length) return addToast('No files selected', 'error');
    files.forEach(f => window.api?.startConvert(buildJob(f)));
    addToast(`Converting ${files.length} video(s)…`, 'info');
  }

  function addToQueue() {
    if (!files.length) return addToast('No files selected', 'error');
    const jobs = files.map(f => ({ ...buildJob(f), status: 'pending', progress: 0 }));
    queue.update(q => [...q, ...jobs]);
    addToast(`Added ${jobs.length} job(s) to queue`, 'info');
  }
</script>

<h1>Video conversion</h1>
<p class="subtitle">MP4, MKV, AVI, MOV, WEBM and FLV &mdash; with full codec control.</p>

<div class="files">
  <DropZone
    bind:files
    variant="chips"
    addLabel="+ Add videos"
    filters={[{ name: 'Videos', extensions: ['mp4','mkv','avi','mov','webm','flv','wmv','ts','m4v'] }]}
  />
</div>

<div class="grid2">
  <div class="glass-row">
    <div class="row-label">Format</div>
    <div class="select-wrap">
      <select bind:value={format}>
        <option value="mp4">MP4</option><option value="mkv">MKV</option>
        <option value="avi">AVI</option><option value="mov">MOV</option>
        <option value="webm">WEBM</option><option value="flv">FLV</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div class="row-label">Video codec</div>
    <div class="select-wrap">
      <select bind:value={codec}>
        <option value="libx264">H.264</option><option value="libx265">H.265</option>
        <option value="libvpx-vp9">VP9</option><option value="copy">Copy</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div class="row-label">Audio codec</div>
    <div class="select-wrap">
      <select bind:value={acodec}>
        <option value="aac">AAC</option><option value="libmp3lame">MP3</option>
        <option value="libopus">Opus</option><option value="copy">Copy</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div class="row-label">Preset</div>
    <div class="select-wrap">
      <select bind:value={preset}>
        <option value="ultrafast">Ultrafast</option><option value="fast">Fast</option>
        <option value="medium">Medium</option><option value="slow">Slow</option>
        <option value="veryslow">Very slow</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div class="row-label">Resolution</div>
    <div class="select-wrap">
      <select bind:value={resolution}>
        <option value="">Original</option><option value="3840:-1">4K</option>
        <option value="1920:-1">1080p</option><option value="1280:-1">720p</option>
        <option value="854:-1">480p</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div class="row-label">Frame rate</div>
    <div class="select-wrap">
      <select bind:value={fps}>
        <option value="">Original</option><option value="60">60</option>
        <option value="30">30</option><option value="24">24</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div class="row-label">Audio bitrate</div>
    <div class="select-wrap">
      <select bind:value={abitrate}>
        <option value="320k">320 kbps</option><option value="256k">256 kbps</option>
        <option value="192k">192 kbps</option><option value="128k">128 kbps</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row full">
    <div>
      <div class="row-label">Output folder</div>
      <div class="row-hint">Where converted files are saved</div>
    </div>
    <div class="folder-group">
      <input type="text" value={outputDir} placeholder="Same as source" readonly>
      <button class="btn-browse" on:click={pickDir}>Browse</button>
    </div>
  </div>
  <div class="glass-row full">
    <div>
      <div class="row-label">CRF quality</div>
      <div class="row-hint">Lower is higher quality</div>
    </div>
    <div class="slider-group">
      <input type="range" min="0" max="51" bind:value={crf}>
      <span class="slider-val">{crf}</span>
    </div>
  </div>
</div>

<div class="actions">
  <button class="btn-accent" on:click={convert}>
    {files.length ? `Convert ${files.length} video${files.length === 1 ? '' : 's'}` : 'Convert videos'}
  </button>
  <button class="btn-glass" on:click={addToQueue}>Add to queue</button>
</div>

<style>
  .files { margin-bottom: 16px; }
</style>
