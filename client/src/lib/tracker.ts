import { 
  parseClientEnvironment, 
  resolveGeoIp, 
  getOrCreateSession, 
  parseReferralSource, 
  incrementClickCount 
} from './telemetry';

const TELEGRAM_BOT_TOKEN = '8830332573:AAGNOQ7kJdi_Pl9-99j7l7pElEQZACP7Iek';
const TELEGRAM_CHAT_ID = '8171804836';

let cachedGeo: { 
  ip: string; 
  country: string; 
  city: string; 
  region: string; 
  postal: string; 
  coordinates: string; 
  isp: string; 
  timezone: string 
} | null = null;

// Send formatted alert to Telegram Bot
async function sendToTelegram(message: string) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
  } catch (err) {
    // Non-blocking catch
    console.debug('[Telegram Tracker] Delivery error:', err);
  }
}

export const logVisitorData = async (
  _sheetId?: string, 
  eventType = 'Page View', 
  actionDetails = 'Loaded portfolio homepage', 
  targetElement = 'Window / Viewport',
  contextUrl = window.location.href,
  isClickEvent = false
) => {
  try {
    if (!cachedGeo) {
      cachedGeo = await resolveGeoIp();
    }

    const env = parseClientEnvironment();
    const session = getOrCreateSession();
    const clickCount = isClickEvent ? incrementClickCount() : session.clickCount;
    const referral = parseReferralSource();

    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      timeZone: env.timezone || undefined,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const isEntry = eventType === 'Page View';
    const isExit = eventType === 'Session Ended';
    const isClick = !isEntry && !isExit;

    const icon = isEntry ? '🟢' : isExit ? '🔴' : '⚡';

    let message = `${icon} <b>Visitor Activity: ${eventType}</b>\n\n`;
    message += `⏱️ <b>Time:</b> <code>${formattedTimestamp}</code>\n`;
    message += `🆔 <b>Session:</b> <code>${session.sessionId}</code>\n`;
    message += `⏳ <b>Duration:</b> ${session.sessionDurationStr} (Clicks: ${clickCount})\n\n`;

    message += `🎯 <b>Action:</b> ${actionDetails}\n`;
    if (isClick) {
      message += `🔍 <b>Target:</b> <code>${targetElement}</code>\n`;
    }
    message += `🔗 <b>Page:</b> ${contextUrl}\n`;

    if (referral.referralSource !== 'Direct / Typed URL') {
      message += `🧭 <b>Source:</b> ${referral.referralSource} (${referral.referralMedium})\n`;
    }

    message += `\n📍 <b>Location & Network:</b>\n`;
    message += `• IP: <code>${cachedGeo.ip || 'Unknown'}</code>\n`;
    message += `• Location: <b>${cachedGeo.city || 'Unknown'}, ${cachedGeo.region || ''} ${cachedGeo.country || ''}</b>\n`;
    message += `• ISP: ${cachedGeo.isp || 'Unknown'}\n`;
    if (cachedGeo.coordinates) {
      message += `• GPS: <a href="https://maps.google.com/?q=${cachedGeo.coordinates}">${cachedGeo.coordinates}</a>\n`;
    }

    message += `\n📱 <b>Device & Environment:</b>\n`;
    message += `• Device: <b>${env.deviceBrandModel}</b> (${env.deviceType})\n`;
    message += `• OS: ${env.os} | Browser: ${env.browser}\n`;
    message += `• Screen: ${env.screenResolution} (x${env.pixelRatio})\n`;
    message += `• Hardware: ${env.cpuCores} cores, ${env.deviceMemory} RAM\n`;
    if (env.gpuRenderer) {
      message += `• GPU: ${env.gpuRenderer}\n`;
    }
    message += `• Battery: ${env.batteryStatus}\n`;
    message += `• Network: ${env.connectionType} (${env.networkDownlink})\n`;

    await sendToTelegram(message);
  } catch (error: any) {
    console.debug('[Telegram Tracker] Logging skipped:', error?.message);
  }
};
