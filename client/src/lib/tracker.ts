import { crawlAccurateVisitorData, countryCodeToFlag, AccurateVisitorData } from './telemetry';

const TELEGRAM_BOT_TOKEN = '8830332573:AAGNOQ7kJdi_Pl9-99j7l7pElEQZACP7Iek';
const TELEGRAM_CHAT_ID = '8171804836';

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

// Anti-spam deduplication locks
let lastSentTime = 0;
let lastSentHash = '';

// Multi-Tier Dispatcher with Single Execution Guarantee
export async function sendToTelegram(htmlMessage: string): Promise<TrackerResult> {
  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const now = Date.now();

  const messageHash = htmlMessage.slice(0, 100);
  if (messageHash === lastSentHash && now - lastSentTime < 4000) {
    return { sent: true, method: 'deduplicated' };
  }

  lastSentHash = messageHash;
  lastSentTime = now;

  // Pipeline 1: Direct JSON
  try {
    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: htmlMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      }),
      keepalive: true
    });

    if (res.ok) {
      return { sent: true, method: 'direct-json' };
    }
  } catch {}

  // Pipeline 2: URLSearchParams (CORS-safe fallback)
  try {
    const params = new URLSearchParams();
    params.append('chat_id', TELEGRAM_CHAT_ID);
    params.append('text', htmlMessage);
    params.append('parse_mode', 'HTML');
    params.append('disable_web_page_preview', 'true');

    const res = await fetch(telegramUrl, {
      method: 'POST',
      body: params,
      keepalive: true
    });

    if (res.ok) {
      return { sent: true, method: 'direct-urlencoded' };
    }
  } catch {}

  // Pipeline 3: navigator.sendBeacon
  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const form = new FormData();
      form.append('chat_id', TELEGRAM_CHAT_ID);
      form.append('text', htmlMessage);
      form.append('parse_mode', 'HTML');
      form.append('disable_web_page_preview', 'true');

      if (navigator.sendBeacon(telegramUrl, form)) {
        return { sent: true, method: 'sendBeacon' };
      }
    }
  } catch {}

  // Pipeline 4: Server-Side Proxy Fallback
  try {
    const res = await fetch('/api/telegram-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: htmlMessage }),
      keepalive: true
    });
    if (res.ok) {
      return { sent: true, method: 'server-proxy' };
    }
  } catch {}

  return { sent: false, method: 'failed', error: 'Delivery pipelines unreachable' };
}

let sessionClickNumber = 0;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Clean GPU model name for display
function cleanGpuName(raw: string): string {
  if (!raw || raw === 'Standard WebGL Renderer' || raw === 'Standard WebGL') return 'Hardware Accelerated GPU';
  let cleaned = raw
    .replace(/ANGLE \(/i, '')
    .replace(/vs_\d+_\d+.*/i, '')
    .replace(/Direct3D.*/i, '')
    .replace(/\(.*?\)/g, '')
    .replace(/,\s*$/, '')
    .trim();
  return cleaned.length > 28 ? cleaned.slice(0, 28) + '…' : cleaned;
}

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
    if (isClickEvent) {
      sessionClickNumber++;
    }

    const data: AccurateVisitorData = await crawlAccurateVisitorData();
    const flag = countryCodeToFlag(data.countryCode);

    let report = '';

    if (isClickEvent) {
      const tag = clickMeta?.tagName ? clickMeta.tagName.toUpperCase() : 'ELEMENT';
      const classes = clickMeta?.className ? escapeHtml(clickMeta.className.slice(0, 30)) : '';
      const text = clickMeta?.textContent ? escapeHtml(clickMeta.textContent.slice(0, 45)) : '';

      report = `⚡ <b>INTERACTION #${sessionClickNumber} DETECTED</b>\n\n` +
        `🎯 <b>Target Action:</b>\n` +
        `├ <b>Tag:</b> <code>&lt;${tag}&gt;</code>\n` +
        (classes ? `├ <b>Class:</b> <code>.${classes.split(' ')[0]}</code>\n` : '') +
        (text ? `├ <b>Label:</b> "<b>${text}</b>"\n` : '') +
        `├ <b>Action:</b> ${escapeHtml(actionDetails.slice(0, 50))}\n` +
        `└ <b>Route:</b> <code>${window.location.pathname}</code>\n\n` +
        `👤 <b>Visitor Profile:</b>\n` +
        `├ <b>IP:</b> <code>${data.ip}</code> (${data.city}, ${data.country} ${flag})\n` +
        `├ <b>Device:</b> ${data.deviceType} • ${data.operatingSystem}\n` +
        `├ <b>Browser:</b> ${data.browserName}\n` +
        `└ <b>Duration:</b> ⏱️ <b>${data.sessionDuration}</b>`;
    } else {
      const mapBtn = data.coordinates !== 'N/A'
        ? ` • <a href="https://www.google.com/maps/search/?api=1&query=${data.coordinates}">🗺️ <b>Live GPS Map</b></a>`
        : '';

      const prettyGpu = cleanGpuName(data.gpuRenderer);
      const cleanIsp = data.isp.length > 25 ? data.isp.slice(0, 25) + '…' : data.isp;
      const cleanReferrer = data.referrer
        ? (data.referrer.length > 28 ? data.referrer.slice(0, 28) + '…' : data.referrer)
        : 'Direct Entry';

      // Comprehensive Visitor Intelligence Report
      report = `🚨 <b>NEW VISITOR ARRIVED</b> ${flag}\n\n` +
        `🌐 <b>NETWORK & GEOLOCATION</b>\n` +
        `├ <b>IP:</b> <code>${data.ip}</code>\n` +
        `├ <b>City:</b> ${data.city} (${data.region || 'N/A'})\n` +
        `├ <b>Country:</b> <b>${data.country}</b> ${flag}\n` +
        `├ <b>ISP / ASN:</b> ${cleanIsp} (<code>${data.asn}</code>)\n` +
        `├ <b>Time:</b> 🕒 <b>${data.timeFormatted}</b> (${data.timeZone})\n` +
        `└ <b>GPS Coordinates:</b> ${data.coordinates}${mapBtn}\n\n` +
        `💻 <b>HARDWARE & SPECS</b>\n` +
        `├ <b>Device / OS:</b> <b>${data.deviceType}</b> • <code>${data.operatingSystem}</code>\n` +
        `├ <b>Processor:</b> ⚙️ ${data.cpuCores} (${data.deviceMemory})\n` +
        `├ <b>Graphics:</b> 🎮 <code>${prettyGpu}</code>\n` +
        `├ <b>JS Heap Memory:</b> 📊 ${data.jsHeapSize}\n` +
        `└ <b>Storage Quota:</b> 💾 ${data.storageQuota}\n\n` +
        `🖥️ <b>DISPLAY & BROWSER</b>\n` +
        `├ <b>Browser:</b> ${data.browserName}\n` +
        `├ <b>Screen:</b> <code>${data.screenResolution}</code> (Avail: ${data.availableScreen})\n` +
        `├ <b>Viewport / Scale:</b> ${data.viewportResolution} @ ${data.devicePixelRatio} (${data.orientation})\n` +
        `├ <b>Touch Support:</b> ${data.touchSupport}\n` +
        `├ <b>Battery:</b> 🔋 ${data.batteryStatus}\n` +
        `└ <b>Settings:</b> ${data.prefersColorScheme} Mode | Cookies: ${data.cookieStatus} | Lang: ${data.primaryLanguage}\n\n` +
        `🧭 <b>SESSION INTELLIGENCE</b>\n` +
        `├ <b>Connection:</b> 📶 ${data.connectionType} (${data.connectionSpeed})\n` +
        `├ <b>Referrer:</b> 🔗 ${escapeHtml(cleanReferrer)}\n` +
        `├ <b>Landing Page:</b> <code>${window.location.pathname}</code>\n` +
        `└ <b>Session ID:</b> <code>#${data.sessionId}</code>`;
    }

    return await sendToTelegram(report);
  } catch (error: any) {
    console.error('[Tracker] Crawl error:', error);
    return { sent: false, method: 'error', error: error?.message };
  }
};
