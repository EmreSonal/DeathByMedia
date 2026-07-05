<script>
  import DropZone from './DropZone.svelte';
  import { addToast, enqueueJobs, hwEncoders, uid, dirname, stripExt } from '../stores/app.js';

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

  // Hardware acceleration: '' = software; otherwise a vendor whose
  // encoder for the selected codec family passed the startup probe.
  let accel = '';
  let accelDefaulted = false;
  const accelLabels = { nvenc: 'NVIDIA (NVENC)', qsv: 'Intel (QuickSync)', amf: 'AMD (AMF)' };
  const familyMap = { libx264: 'h264', libx265: 'hevc' };

  $: family = familyMap[codec] || null;
  $: availableAccels = family && $hwEncoders
    ? ['nvenc', 'qsv', 'amf'].filter(a => $hwEncoders[`${family}_${a}`])
    : [];
  // Default to the best available hardware encoder once detection lands
  $: if (!accelDefaulted && $hwEncoders && family) {
    accelDefaulted = true;
    accel = availableAccels[0] || '';
  }
  // Fall back to software when the codec changes to one the current
  // vendor can't encode (or to VP9/Copy, which are software-only)
  $: if (accel && !availableAccels.includes(accel)) accel = '';

  async function pickDir() {
    const dir = await window.api?.openFolder();
    if (dir) outputDir = dir;
  }

  function buildJob(file) {
    const outDir = outputDir || dirname(file.path);
    const outName = stripExt(file.name) + '_converted.' + format;
    const encoder = accel && family ? `${family}_${accel}` : codec;
    return {
      id: uid(), type: 'video', input: file.path, output: outDir + '/' + outName,
      format, codec: encoder, hw: accel || null, audioCodec: acodec, preset, crf,
      resolution: resolution || null, fps: fps || null, audioBitrate: abitrate,
      displayName: file.name, outputName: outName,
      detail: `Video → ${format.toUpperCase()} · ${codecLabels[codec] || codec}${accel ? ` (${accel.toUpperCase()})` : ''} · CRF ${crf}`,
    };
  }

  function convert() {
    if (!files.length) return addToast('No files selected', 'error');
    enqueueJobs(files.map(buildJob), { start: true });
    addToast(`Converting ${files.length} video(s)…`, 'info');
  }

  function addToQueue() {
    if (!files.length) return addToast('No files selected', 'error');
    enqueueJobs(files.map(buildJob));
    addToast(`Added ${files.length} job(s) to queue`, 'info');
  }
</script>

<h1>Video conversion</h1>
<p class="subtitle">MP4, MKV, AVI, MOV, WEBM and FLV &mdash; with full codec control.</p>

<DropZone
  bind:files
  variant="list"
  label="Drop videos here"
  hint="MP4 &middot; MKV &middot; AVI &middot; MOV &middot; WEBM &middot; FLV &middot; WMV &middot; TS"
  addLabel="+ Add more"
  filters={[{ name: 'Videos', extensions: ['mp4','mkv','avi','mov','webm','flv','wmv','ts','m4v'] }]}
  icon={`<rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10,8 16,12 10,16"/>`}
/>

{#if files.length > 0}
  <div class="panel">
    <div class="panel-grid-2">
      <div class="field">
        <label for="v-format">Output Format</label>
        <select id="v-format" bind:value={format}>
          <option value="mp4">MP4</option><option value="mkv">MKV</option>
          <option value="avi">AVI</option><option value="mov">MOV</option>
          <option value="webm">WEBM</option><option value="flv">FLV</option>
        </select>
      </div>
      <div class="field">
        <label for="v-codec">Video Codec</label>
        <select id="v-codec" bind:value={codec}>
          <option value="libx264">H.264 (x264)</option><option value="libx265">H.265 (x265)</option>
          <option value="libvpx-vp9">VP9</option><option value="copy">Copy (no re-encode)</option>
        </select>
      </div>
      <div class="field">
        <label for="v-accel">Encoder</label>
        <select id="v-accel" bind:value={accel} disabled={!family || !availableAccels.length}>
          <option value="">Software (CPU)</option>
          {#each availableAccels as a}
            <option value={a}>{accelLabels[a]}</option>
          {/each}
        </select>
      </div>
      <div class="field">
        <label for="v-acodec">Audio Codec</label>
        <select id="v-acodec" bind:value={acodec}>
          <option value="aac">AAC</option><option value="libmp3lame">MP3</option>
          <option value="libopus">Opus</option><option value="copy">Copy</option>
        </select>
      </div>
      <div class="field">
        <label for="v-preset">Preset</label>
        <select id="v-preset" bind:value={preset}>
          <option value="ultrafast">Ultrafast</option><option value="fast">Fast</option>
          <option value="medium">Medium</option><option value="slow">Slow</option>
          <option value="veryslow">Very Slow</option>
        </select>
      </div>
      <div class="field">
        <label for="v-crf">CRF Quality <span class="val">{crf}</span></label>
        <input id="v-crf" type="range" min="0" max="51" bind:value={crf}>
      </div>
      <div class="field">
        <label for="v-resolution">Resolution</label>
        <select id="v-resolution" bind:value={resolution}>
          <option value="">Original</option><option value="3840:-2">4K</option>
          <option value="1920:-2">1080p</option><option value="1280:-2">720p</option>
          <option value="854:-2">480p</option>
        </select>
      </div>
      <div class="field">
        <label for="v-fps">FPS</label>
        <select id="v-fps" bind:value={fps}>
          <option value="">Original</option><option value="60">60</option>
          <option value="30">30</option><option value="24">24</option>
        </select>
      </div>
      <div class="field">
        <label for="v-abitrate">Audio Bitrate</label>
        <select id="v-abitrate" bind:value={abitrate}>
          <option value="320k">320 kbps</option><option value="256k">256 kbps</option>
          <option value="192k">192 kbps</option><option value="128k">128 kbps</option>
        </select>
      </div>
    </div>
    <div class="field">
      <label for="v-outdir">Output Folder</label>
      <div class="folder-row">
        <input id="v-outdir" type="text" value={outputDir} placeholder="Same as source" readonly>
        <button class="btn-browse" on:click={pickDir}>Browse</button>
      </div>
    </div>
    <div class="panel-actions">
      <button class="btn-accent" on:click={convert}>
        Convert {files.length} video{files.length === 1 ? '' : 's'}
      </button>
      <button class="btn-glass" on:click={addToQueue}>Add to queue</button>
    </div>
  </div>
{/if}
