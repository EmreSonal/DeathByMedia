<script>
  import {
    ytUrl, ytFormat, ytResolution, ytOutputDir, ytInfo, ytFetching, ytJob,
    fetchYtInfo, startYtDownload, cancelYtDownload,
  } from '../stores/app.js';

  const formatLabels = { best: 'Best quality', mp4: 'MP4', webm: 'WEBM', mp3: 'MP3' };
  $: downloadLabel = ($ytResolution ? `${$ytResolution}p ` : '') + (formatLabels[$ytFormat] || $ytFormat);

  async function pickDir() {
    const dir = await window.api?.openFolder();
    if (dir) $ytOutputDir = dir;
  }
</script>

<h1>YouTube downloader</h1>
<p class="subtitle">Paste a link, pick a quality, download video or audio.</p>

<div class="url-row">
  <input type="text" bind:value={$ytUrl} placeholder="Paste a YouTube URL&hellip;" spellcheck="false">
  <button class="btn-accent fetch-btn" on:click={fetchYtInfo} disabled={$ytFetching}>
    {$ytFetching ? 'Fetching…' : 'Fetch info'}
  </button>
</div>

{#if $ytInfo}
  <div class="info-card">
    <div class="thumb-wrap">
      {#if $ytInfo.thumbnail}
        <img src={$ytInfo.thumbnail} alt="" class="thumb">
      {:else}
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.55"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75,15.02 15.5,11.75 9.75,8.48"/></svg>
      {/if}
    </div>
    <div class="meta">
      <div class="vid-title">{$ytInfo.title}</div>
      <div class="vid-sub">{[$ytInfo.uploader, $ytInfo.duration].filter(Boolean).join(' · ')}</div>
    </div>
  </div>
{/if}

<div class="panel">
  <div class="panel-grid-2">
    <div class="field">
      <label for="y-format">Download Format</label>
      <select id="y-format" bind:value={$ytFormat}>
        <option value="best">Best quality (video)</option>
        <option value="mp4">MP4</option>
        <option value="webm">WEBM</option>
        <option value="mp3">MP3 (audio only)</option>
      </select>
    </div>
    <div class="field">
      <label for="y-resolution">Max Resolution</label>
      <select id="y-resolution" bind:value={$ytResolution}>
        <option value="">Best available</option>
        <option value="2160">4K</option><option value="1080">1080p</option>
        <option value="720">720p</option><option value="480">480p</option>
      </select>
    </div>
  </div>
  <div class="field">
    <label for="y-outdir">Save To</label>
    <div class="folder-row">
      <input id="y-outdir" type="text" value={$ytOutputDir} placeholder="Select download folder&hellip;" readonly>
      <button class="btn-browse" on:click={pickDir}>Browse</button>
    </div>
  </div>
  <div class="panel-actions">
    <button class="btn-accent" on:click={startYtDownload} disabled={$ytJob.downloading || !$ytInfo || !$ytOutputDir}>
      Download
    </button>
  </div>
</div>

{#if $ytJob.downloading}
  <div class="progress-card">
    <div class="prog-header">
      <span class="prog-label">Downloading&hellip; {downloadLabel}</span>
      <span class="pct">{$ytJob.progress}%</span>
    </div>
    <div class="prog-track">
      <div class="prog-fill" style="width:{$ytJob.progress}%"></div>
    </div>
    <div class="prog-footer">
      <span class="prog-detail">{$ytJob.line}</span>
      <button class="cancel-btn" on:click={cancelYtDownload}>Cancel</button>
    </div>
  </div>
{/if}

<style>
  .url-row { display: flex; gap: 10px; margin-bottom: 14px; }
  .url-row input {
    flex: 1; height: 40px; padding: 0 16px; font-size: 14px;
    border-radius: 6px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .fetch-btn { height: 40px; padding: 0 22px; }

  .info-card {
    display: flex; gap: 16px; padding: 14px;
    background: var(--layer);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border: 1px solid var(--stroke-hi);
    border-radius: 10px;
  }
  .thumb-wrap {
    width: 168px; height: 94px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(76,194,255,0.25), rgba(122,90,248,0.25));
    display: flex; align-items: center; justify-content: center;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    overflow: hidden;
  }
  .thumb { width: 100%; height: 100%; object-fit: cover; display: block; }
  .meta { flex: 1; min-width: 0; align-self: center; }
  .vid-title { font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vid-sub { color: var(--text2); font-size: 12.5px; margin-top: 2px; }

  .progress-card {
    margin-top: 14px; padding: 14px 18px;
    background: var(--layer);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border: 1px solid var(--stroke-hi);
    border-radius: 10px;
  }
  .prog-header { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
  .prog-label { color: var(--text2); }
  .pct { font-weight: 600; }
  .prog-track { height: 5px; background: var(--track); border-radius: 99px; overflow: hidden; }
  .prog-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), #7A5AF8);
    border-radius: 99px;
    box-shadow: 0 0 10px var(--blob1);
    transition: width 200ms linear;
  }
  .prog-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
  .prog-detail {
    font-size: 11.5px; color: var(--text3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-right: 12px;
  }
  .cancel-btn {
    height: 28px; padding: 0 14px; flex-shrink: 0;
    border: 1px solid rgba(196,43,28,0.4);
    border-radius: 5px;
    background: rgba(196,43,28,0.12);
    color: #ff8a80;
    font-size: 12px; font-weight: 600; font-family: inherit;
    cursor: pointer;
    transition: background var(--transition);
  }
  .cancel-btn:hover { background: rgba(196,43,28,0.22); }
  :global([data-theme="light"]) .cancel-btn { color: #c42b1c; }
</style>
