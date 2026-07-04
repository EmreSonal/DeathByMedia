<script>
  import DropZone from './DropZone.svelte';
  import { queue, addToast, uid, dirname, stripExt, audioCodecMap } from '../stores/app.js';

  let files = [];
  let format = 'mp3';
  let bitrate = '192k';
  let sampleRate = '';
  let outputDir = '';

  async function pickDir() {
    const dir = await window.api?.openFolder();
    if (dir) outputDir = dir;
  }

  function buildJob(file) {
    const outDir = outputDir || dirname(file.path);
    const outName = stripExt(file.name) + '.' + format;
    return {
      id: uid(), type: 'audio', input: file.path, output: outDir + '/' + outName,
      format, audioCodec: audioCodecMap[format] || format,
      audioBitrate: bitrate, sampleRate: sampleRate || null,
      displayName: file.name, outputName: outName,
      detail: `Audio → ${format.toUpperCase()} · ${bitrate.replace('k', ' kbps')}`,
    };
  }

  function convert() {
    if (!files.length) return addToast('No files selected', 'error');
    files.forEach(f => window.api?.startConvert(buildJob(f)));
    addToast(`Extracting audio from ${files.length} file(s)…`, 'info');
  }

  function addToQueue() {
    if (!files.length) return addToast('No files selected', 'error');
    const jobs = files.map(f => ({ ...buildJob(f), status: 'pending', progress: 0 }));
    queue.update(q => [...q, ...jobs]);
    addToast(`Added ${jobs.length} job(s) to queue`, 'info');
  }
</script>

<h1>Audio extraction</h1>
<p class="subtitle">Pull the audio track out of any media file &mdash; MP3, FLAC, WAV, AAC, OGG.</p>

<div class="files">
  <DropZone
    bind:files
    variant="chips"
    addLabel="+ Add media"
    filters={[{ name: 'Media', extensions: ['mp4','mkv','avi','mov','webm','flv','wmv','mp3','flac','wav','aac','ogg','m4a','wma'] }]}
  />
</div>

<div class="rows">
  <div class="glass-row">
    <div>
      <div class="row-label">Output format</div>
      <div class="row-hint">Lossy or lossless target</div>
    </div>
    <div class="select-wrap">
      <select bind:value={format}>
        <option value="mp3">MP3</option><option value="flac">FLAC</option>
        <option value="wav">WAV</option><option value="aac">AAC</option>
        <option value="ogg">OGG</option><option value="m4a">M4A</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div>
      <div class="row-label">Bitrate</div>
      <div class="row-hint">Ignored for lossless formats</div>
    </div>
    <div class="select-wrap">
      <select bind:value={bitrate}>
        <option value="320k">320 kbps</option><option value="256k">256 kbps</option>
        <option value="192k">192 kbps</option><option value="128k">128 kbps</option>
        <option value="96k">96 kbps</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div>
      <div class="row-label">Sample rate</div>
      <div class="row-hint">Keep original unless you need smaller files</div>
    </div>
    <div class="select-wrap">
      <select bind:value={sampleRate}>
        <option value="">Original</option><option value="48000">48 kHz</option>
        <option value="44100">44.1 kHz</option><option value="22050">22.05 kHz</option>
      </select>
      <svg class="chev" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/></svg>
    </div>
  </div>
  <div class="glass-row">
    <div>
      <div class="row-label">Output folder</div>
      <div class="row-hint">Where extracted audio is saved</div>
    </div>
    <div class="folder-group">
      <input type="text" value={outputDir} placeholder="Same as source" readonly>
      <button class="btn-browse" on:click={pickDir}>Browse</button>
    </div>
  </div>
</div>

<div class="actions">
  <button class="btn-accent" on:click={convert}>Extract audio</button>
  <button class="btn-glass" on:click={addToQueue}>Add to queue</button>
</div>

<style>
  .files { margin-bottom: 16px; }
</style>
