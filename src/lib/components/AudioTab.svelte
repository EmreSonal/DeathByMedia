<script>
  import DropZone from './DropZone.svelte';
  import { addToast, enqueueJobs, uid, dirname, stripExt, audioCodecMap } from '../stores/app.js';

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
    enqueueJobs(files.map(buildJob), { start: true });
    addToast(`Extracting audio from ${files.length} file(s)…`, 'info');
  }

  function addToQueue() {
    if (!files.length) return addToast('No files selected', 'error');
    enqueueJobs(files.map(buildJob));
    addToast(`Added ${files.length} job(s) to queue`, 'info');
  }
</script>

<h1>Audio extraction</h1>
<p class="subtitle">Pull the audio track out of any media file &mdash; MP3, FLAC, WAV, AAC, OGG.</p>

<DropZone
  bind:files
  variant="list"
  label="Drop video or audio files here"
  hint="Any video or audio format with an audio track"
  addLabel="+ Add more"
  filters={[{ name: 'Media', extensions: ['mp4','mkv','avi','mov','webm','flv','wmv','mp3','flac','wav','aac','ogg','m4a','wma'] }]}
  icon={`<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`}
/>

{#if files.length > 0}
  <div class="panel">
    <div class="panel-grid-3">
      <div class="field">
        <label for="a-format">Output Format</label>
        <select id="a-format" bind:value={format}>
          <option value="mp3">MP3</option><option value="flac">FLAC</option>
          <option value="wav">WAV</option><option value="aac">AAC</option>
          <option value="ogg">OGG</option><option value="m4a">M4A</option>
        </select>
      </div>
      <div class="field">
        <label for="a-bitrate">Bitrate</label>
        <select id="a-bitrate" bind:value={bitrate}>
          <option value="320k">320 kbps</option><option value="256k">256 kbps</option>
          <option value="192k">192 kbps</option><option value="128k">128 kbps</option>
          <option value="96k">96 kbps</option>
        </select>
      </div>
      <div class="field">
        <label for="a-samplerate">Sample Rate</label>
        <select id="a-samplerate" bind:value={sampleRate}>
          <option value="">Original</option><option value="48000">48 kHz</option>
          <option value="44100">44.1 kHz</option><option value="22050">22.05 kHz</option>
        </select>
      </div>
    </div>
    <div class="field">
      <label for="a-outdir">Output Folder</label>
      <div class="folder-row">
        <input id="a-outdir" type="text" value={outputDir} placeholder="Same as source" readonly>
        <button class="btn-browse" on:click={pickDir}>Browse</button>
      </div>
    </div>
    <div class="panel-actions">
      <button class="btn-accent" on:click={convert}>Extract audio</button>
      <button class="btn-glass" on:click={addToQueue}>Add to queue</button>
    </div>
  </div>
{/if}
