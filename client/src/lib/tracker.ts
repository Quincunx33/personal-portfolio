import { crawlAccurateVisitorData, countryCodeToFlag, AccurateVisitorData, getSessionInfo } from './telemetry';

export interface TrackerResult {
  sent: boolean;
  method: string;
  error?: string;
}

export interface ClickMetadata {
  tagName: string;
  className: string;
  textContent: string;
  id?: string;
  role?: string;
  href?: string;
}

// Anti-spam deduplication & queue rate limit
let lastSentTime = 0;
let lastSentHash = '';
const messageQueue: string[] = [];
let isProcessingQueue = false;

function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Multi-Tier Dispatcher with Single Execution Guarantee & Queue Drain
export async function sendToTelegram(htmlMessage: string, isPriority = false): Promise<TrackerResult> {
  const now = Date.now();
  const messageHash = htmlMessage.slice(0, 120);

  // Suppress direct identical duplicates within 3.5 seconds unless marked priority
  if (!isPriority && messageHash === lastSentHash && now - lastSentTime < 3500) {
    return { sent: true, method: 'deduplicated' };
  }

  lastSentHash = messageHash;
  lastSentTime = now;

  try {
    const res = await fetch('/api/telegram-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: htmlMessage
      }),
      keepalive: true
    });

    if (res.ok) {
      return { sent: true, method: 'server-proxy' };
    }
  } catch {}

  return { sent: false, method: 'failed', error: 'Delivery pipeline unreachable' };
}

// Clean GPU model name for compact Telegram typography
function cleanGpuName(raw: string): string {
  if (!raw || raw === 'Standard WebGL Renderer' || raw === 'Standard WebGL') return 'Hardware Accelerated GPU';
  let cleaned = raw
    .replace(/ANGLE \(/i, '')
    .replace(/vs_\d+_\d+.*/i, '')
    .replace(/Direct3D.*/i, '')
    .replace(/\(.*?\)/g, '')
    .replace(/,\s*$/, '')
    .trim();
  return cleaned.length > 34 ? cleaned.slice(0, 34) + '…' : cleaned;
}

// -------------------------------------------------------------
// 1. PRIMARY VISITOR RECONNAISSANCE DOSSIER (PAGE VIEW)
// -------------------------------------------------------------
let cachedVisitorData: AccurateVisitorData | null = null;

async function getOrCrawlVisitor(): Promise<AccurateVisitorData> {
  if (cachedVisitorData) return cachedVisitorData;
  cachedVisitorData = await crawlAccurateVisitorData();
  return cachedVisitorData;
}

export async function trackPageView(pageTitle?: string): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const flag = countryCodeToFlag(data.countryCode);
    const prettyGpu = cleanGpuName(data.gpuRenderer);
    const cleanIsp = data.isp.length > 28 ? data.isp.slice(0, 28) + '…' : data.isp;

    const mapBtn = data.coordinates !== 'N/A'
      ? ` • <a href="${data.gmapsUrl}">🗺️ <b>Live GPS Map</b></a>`
      : '';

    const returningTag = data.isReturningVisitor
      ? `🔄 <b>Returning Visitor (#${data.visitCount})</b>`
      : '✨ <b>First-Time Visitor</b>';

    const report =
      `🚨 <b>NEW VISITOR ARRIVED</b> ${flag}\n\n` +
      `🌐 <b>NETWORK & GEOLOCATION:</b>\n` +
      `├ <b>IP:</b> <code>${data.ip}</code> (${data.ipType})\n` +
      `├ <b>Location:</b> ${data.city}, ${data.region} (${data.country} ${flag})\n` +
      `├ <b>Coordinates:</b> ${data.coordinates}${mapBtn}\n` +
      `├ <b>ISP / ASN:</b> ${cleanIsp} (<code>${data.asn}</code>)\n` +
      `├ <b>Security Status:</b> ${data.securityVerdict}\n` +
      `├ <b>Timezone Integrity:</b> ${data.timezoneAnomaly}\n` +
      `└ <b>Local Clock:</b> 🕒 <b>${data.timeFormatted}</b> (${data.timeZone})\n\n` +
      `💻 <b>HARDWARE & HARDWARE INTEGRITY:</b>\n` +
      `├ <b>Device:</b> <b>${data.deviceType}</b> • <code>${data.operatingSystem}</code>\n` +
      `├ <b>Processor:</b> ⚙️ ${data.cpuCores} (${data.deviceMemory})\n` +
      `├ <b>GPU Vendor:</b> <code>${data.gpuVendor}</code>\n` +
      `├ <b>GPU Renderer:</b> 🎮 <code>${prettyGpu}</code>\n` +
      `├ <b>WebGPU Acceleration:</b> ${data.webGpuSupport}\n` +
      `├ <b>JS Heap Memory:</b> 📊 ${data.jsHeapSize}\n` +
      `├ <b>Storage Quota:</b> 💾 ${data.storageQuota}\n` +
      `└ <b>Sound Card Sample Rate:</b> 🔊 ${data.audioSampleRate}\n\n` +
      `🖥️ <b>DISPLAY & BROWSER SANDBOX:</b>\n` +
      `├ <b>Browser:</b> ${data.browserName}\n` +
      `├ <b>Physical Screen:</b> <code>${data.screenResolution}</code> (Avail: ${data.availableScreen})\n` +
      `├ <b>Viewport / DPR:</b> ${data.viewportResolution} @ ${data.devicePixelRatio} (${data.orientation})\n` +
      `├ <b>Color Fidelity:</b> ${data.colorGamut} • ${data.hdrSupport}\n` +
      `├ <b>Input Interaction:</b> ${data.touchSupport}\n` +
      `├ <b>Battery Status:</b> 🔋 ${data.batteryStatus}\n` +
      `└ <b>Privacy & Mode:</b> ${data.prefersColorScheme} Theme | Cookies: ${data.cookieStatus} | DNT: ${data.doNotTrack}\n\n` +
      `🧭 <b>SESSION ATTRIBUTION:</b>\n` +
      `├ <b>Traffic Source:</b> 🔗 <b>${escapeHtml(data.trafficSource)}</b>\n` +
      `├ <b>Visitor Status:</b> ${returningTag}\n` +
      `├ <b>Entry Target:</b> <code>${window.location.pathname}</code> (${escapeHtml(pageTitle || data.pageTitle)})\n` +
      `└ <b>Session ID:</b> <code>#${data.sessionId}</code>`;

    return await sendToTelegram(report, true);
  } catch (error: any) {
    console.error('[Tracker] trackPageView error:', error);
    return { sent: false, method: 'error', error: error?.message };
  }
}

// -------------------------------------------------------------
// 2. DEFENSIVE & SECURITY THREAT ALERTS (DEVTOOLS / SNIP / AUDIT)
// -------------------------------------------------------------
export async function trackSecurityAlert(
  threatType: string,
  details: {
    trigger: string;
    shortcut?: string;
    caller?: string;
    severity?: 'high' | 'critical' | 'warning';
    extra?: string;
  }
): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const flag = countryCodeToFlag(data.countryCode);
    const session = getSessionInfo();

    const severityEmoji = details.severity === 'critical' ? '🔴 CRITICAL' : (details.severity === 'warning' ? '🟡 NOTICE' : '🚨 HIGH ALERT');

    const report =
      `🛡️ <b>SECURITY AUDIT / INCIDENT DETECTED</b>\n\n` +
      `⚠️ <b>Classification:</b> ${severityEmoji} — <b>${escapeHtml(threatType)}</b>\n` +
      `├ <b>Trigger Event:</b> <code>${escapeHtml(details.trigger)}</code>\n` +
      (details.shortcut ? `├ <b>Key Shortcut:</b> <code>${escapeHtml(details.shortcut)}</code>\n` : '') +
      (details.caller ? `├ <b>REPL / Vector:</b> <code>${escapeHtml(details.caller.slice(0, 50))}</code>\n` : '') +
      (details.extra ? `├ <b>Details:</b> ${escapeHtml(details.extra)}\n` : '') +
      `└ <b>Route:</b> <code>${window.location.pathname}</code>\n\n` +
      `👤 <b>Perpetrator Dossier:</b>\n` +
      `├ <b>IP:</b> <code>${data.ip}</code> (${data.city}, ${data.country} ${flag})\n` +
      `├ <b>Network:</b> ${data.isp} (<code>${data.asn}</code>)\n` +
      `├ <b>Security Check:</b> ${data.securityVerdict}\n` +
      `├ <b>Client OS:</b> ${data.deviceType} • ${data.operatingSystem}\n` +
      `├ <b>Browser:</b> ${data.browserName}\n` +
      `├ <b>Active Duration:</b> ⏱️ <b>${session.sessionDuration}</b>\n` +
      `└ <b>Session ID:</b> <code>#${session.sessionId}</code>`;

    return await sendToTelegram(report, true);
  } catch (err: any) {
    console.error('[Tracker] trackSecurityAlert error:', err);
    return { sent: false, method: 'error', error: err?.message };
  }
}

// -------------------------------------------------------------
// 3. HIGH-INTENT ACTIONS: PROJECTS & CONTACT
// -------------------------------------------------------------

export async function trackProjectInspection(
  project: { name: string; language?: string; type?: string; url?: string },
  action: 'viewed' | 'github_click' | 'copied_url'
): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const flag = countryCodeToFlag(data.countryCode);
    const session = getSessionInfo();

    const actionText =
      action === 'viewed'
        ? '🔬 Opened Deep Architectural Field Note'
        : action === 'github_click'
        ? '🚀 Clicked "Inspect on GitHub" Outbound Link'
        : '📋 Copied Project Repository URL';

    const report =
      `🔬 <b>PROJECT DEEP DIVE INSPECTION</b>\n\n` +
      `🎯 <b>Action:</b> <b>${actionText}</b>\n` +
      `├ <b>Project:</b> <b>${escapeHtml(project.name)}</b>\n` +
      `├ <b>Category:</b> ${escapeHtml(project.type || 'Engineering')}\n` +
      `├ <b>Language:</b> <code>${escapeHtml(project.language || 'Code')}</code>\n` +
      `└ <b>Repository:</b> <a href="${project.url || '#'}">${escapeHtml(project.url || 'GitHub')}</a>\n\n` +
      `👤 <b>Visitor Profile:</b>\n` +
      `├ <b>IP:</b> <code>${data.ip}</code> (${data.city}, ${data.country} ${flag})\n` +
      `├ <b>ISP:</b> ${data.isp}\n` +
      `├ <b>Device:</b> ${data.deviceType} • ${data.operatingSystem}\n` +
      `└ <b>Session ID:</b> <code>#${session.sessionId}</code>`;

    return await sendToTelegram(report, false);
  } catch (err: any) {
    return { sent: false, method: 'error', error: err?.message };
  }
}

export async function trackLampInteraction(action: 'toggle_on' | 'toggle_off'): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const session = getSessionInfo();

    const report =
      `💡 <b>LABORATORY PENDANT LAMP INTERACTION</b>\n\n` +
      `🕹️ <b>State:</b> ${action === 'toggle_on' ? '🔆 Lamp Switched ON' : '🌑 Lamp Switched OFF'}\n` +
      `├ <b>Interactive Feature:</b> Physics-simulated brass pendant lamp\n` +
      `├ <b>Location:</b> ${data.city}, ${data.country}\n` +
      `└ <b>Duration on site:</b> ${session.sessionDuration}`;

    return await sendToTelegram(report, false);
  } catch (err: any) {
    return { sent: false, method: 'error', error: err?.message };
  }
}

export async function trackContactInteraction(
  action: 'opened_modal' | 'copied_email',
  emailAddress?: string
): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const flag = countryCodeToFlag(data.countryCode);
    const session = getSessionInfo();

    const actionText =
      action === 'opened_modal'
        ? '💬 Opened Direct Transmission / Contact Dialog'
        : '📋 Copied Direct Email Mailbox Address';

    const report =
      `✉️ <b>CONTACT / TRANSMISSION INTENT DETECTED</b>\n\n` +
      `🎯 <b>Action:</b> <b>${actionText}</b>\n` +
      (emailAddress ? `├ <b>Address:</b> <code>${escapeHtml(emailAddress)}</code>\n` : '') +
      `├ <b>Time:</b> ${new Date().toLocaleTimeString()}\n` +
      `└ <b>Origin:</b> taissu.pages.dev\n\n` +
      `👤 <b>Sender Dossier:</b>\n` +
      `├ <b>IP:</b> <code>${data.ip}</code> (${data.city}, ${data.country} ${flag})\n` +
      `├ <b>Network:</b> ${data.isp} (<code>${data.asn}</code>)\n` +
      `├ <b>Device:</b> ${data.deviceType} • ${data.operatingSystem}\n` +
      `└ <b>Session ID:</b> <code>#${session.sessionId}</code>`;

    return await sendToTelegram(report, true);
  } catch (err: any) {
    return { sent: false, method: 'error', error: err?.message };
  }
}

// -------------------------------------------------------------
// 5. BEHAVIORAL MILESTONES: SCROLL, ENGAGEMENT & CLIPBOARD
// -------------------------------------------------------------
export async function trackScrollMilestone(percentage: number): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const session = getSessionInfo();

    const report =
      `📜 <b>READING DEPTH MILESTONE: ${percentage}%</b>\n\n` +
      `📍 <b>Milestone:</b> Reached <b>${percentage}%</b> of portfolio canvas\n` +
      `├ <b>Reading Speed:</b> Reached after ⏱️ <b>${session.sessionDuration}</b>\n` +
      `├ <b>Visitor:</b> <code>${data.ip}</code> (${data.city}, ${data.country})\n` +
      `└ <b>Device:</b> ${data.deviceType} • ${data.operatingSystem}`;

    return await sendToTelegram(report, false);
  } catch (err: any) {
    return { sent: false, method: 'error', error: err?.message };
  }
}

export async function trackEngagementMilestone(durationSeconds: number): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const session = getSessionInfo();
    const readable = durationSeconds >= 60 ? `${Math.floor(durationSeconds / 60)}m` : `${durationSeconds}s`;

    const report =
      `⏱️ <b>DEEP ENGAGEMENT MILESTONE (${readable})</b>\n\n` +
      `🔥 <b>Visitor Status:</b> Highly engaged visitor active for <b>${readable}</b>\n` +
      `├ <b>Visitor:</b> <code>${data.ip}</code> (${data.city}, ${data.country})\n` +
      `├ <b>ISP:</b> ${data.isp}\n` +
      `├ <b>Source:</b> ${escapeHtml(data.trafficSource)}\n` +
      `└ <b>Session ID:</b> <code>#${session.sessionId}</code>`;

    return await sendToTelegram(report, false);
  } catch (err: any) {
    return { sent: false, method: 'error', error: err?.message };
  }
}

export async function trackClipboardCopy(copiedText: string): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const session = getSessionInfo();
    const cleanSnippet = copiedText.trim().replace(/\s+/g, ' ').slice(0, 80);

    const report =
      `📋 <b>TEXT COPIED FROM PORTFOLIO</b>\n\n` +
      `✂️ <b>Copied String:</b> "<code>${escapeHtml(cleanSnippet)}</code>"\n` +
      `├ <b>Length:</b> ${copiedText.length} characters\n` +
      `├ <b>Visitor:</b> <code>${data.ip}</code> (${data.city}, ${data.country})\n` +
      `└ <b>Session:</b> #${session.sessionId} (⏱️ ${session.sessionDuration})`;

    return await sendToTelegram(report, false);
  } catch (err: any) {
    return { sent: false, method: 'error', error: err?.message };
  }
}

export async function trackTabFocusChange(state: 'hidden' | 'visible', awaySeconds?: number): Promise<TrackerResult> {
  try {
    const data = await getOrCrawlVisitor();
    const session = getSessionInfo();

    const report =
      `👁️ <b>TAB ATTENTION SHIFT: ${state.toUpperCase()}</b>\n\n` +
      (state === 'hidden'
        ? `💤 <b>Tab Minimized:</b> Visitor switched to another window/app.\n├ <b>Active Duration:</b> ${session.sessionDuration}`
        : `⚡ <b>Tab Restored:</b> Visitor returned to portfolio.\n├ <b>Away Duration:</b> ${awaySeconds || 0} seconds`) +
      `\n└ <b>Visitor:</b> <code>${data.ip}</code> (${data.city}, ${data.country})`;

    return await sendToTelegram(report, false);
  } catch (err: any) {
    return { sent: false, method: 'error', error: err?.message };
  }
}

// -------------------------------------------------------------
// 6. BACKWARD-COMPATIBLE LOGVISITORDATA FOR CLICKS
// -------------------------------------------------------------
let sessionClickNumber = 0;

export const logVisitorData = async (
  _sheetId = 'portfolio',
  eventType = 'Page View',
  actionDetails = 'Viewed homepage',
  targetElement = 'Window',
  _contextUrl = window.location.href,
  isClickEvent = false,
  clickMeta?: ClickMetadata
): Promise<TrackerResult> => {
  try {
    if (!isClickEvent) {
      return await trackPageView(actionDetails);
    }

    sessionClickNumber++;
    const data = await getOrCrawlVisitor();
    const flag = countryCodeToFlag(data.countryCode);
    const session = getSessionInfo();

    const tag = clickMeta?.tagName ? clickMeta.tagName.toUpperCase() : 'ELEMENT';
    const classes = clickMeta?.className ? escapeHtml(clickMeta.className.slice(0, 30)) : '';
    const text = clickMeta?.textContent ? escapeHtml(clickMeta.textContent.slice(0, 45)) : '';

    const report =
      `⚡ <b>INTERACTION #${sessionClickNumber} DETECTED</b>\n\n` +
      `🎯 <b>Target Action:</b>\n` +
      `├ <b>Tag:</b> <code>&lt;${tag}&gt;</code>\n` +
      (classes ? `├ <b>Class:</b> <code>.${classes.split(' ')[0]}</code>\n` : '') +
      (text ? `├ <b>Label:</b> "<b>${text}</b>"\n` : '') +
      `├ <b>Action:</b> ${escapeHtml(actionDetails.slice(0, 60))}\n` +
      `└ <b>Route:</b> <code>${window.location.pathname}</code>\n\n` +
      `👤 <b>Visitor Profile:</b>\n` +
      `├ <b>IP:</b> <code>${data.ip}</code> (${data.city}, ${data.country} ${flag})\n` +
      `├ <b>Device:</b> ${data.deviceType} • ${data.operatingSystem}\n` +
      `├ <b>Browser:</b> ${data.browserName}\n` +
      `└ <b>Duration:</b> ⏱️ <b>${session.sessionDuration}</b>`;

    return await sendToTelegram(report, false);
  } catch (error: any) {
    console.error('[Tracker] logVisitorData error:', error);
    return { sent: false, method: 'error', error: error?.message };
  }
};
