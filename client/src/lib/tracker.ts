import { getAccessToken } from './auth';
import { toast } from 'sonner';
import { 
  parseClientEnvironment, 
  resolveGeoIp, 
  getOrCreateSession, 
  parseReferralSource, 
  incrementClickCount 
} from './telemetry';

// Comprehensive 25-Column Telemetry Schema for Google Sheets
export const SHEET_HEADERS = [
  'Timestamp',
  'Session ID',
  'Session Duration',
  'Click Count',
  'Event Type',
  'Action / Description',
  'Target Element',
  'Page URL',
  'Referral Source',
  'Referral Medium',
  'Device Type',
  'Device Model',
  'Operating System',
  'Browser',
  'CPU / Memory',
  'GPU Hardware',
  'Battery',
  'Network Speed',
  'IP Address',
  'Country',
  'City',
  'Region',
  'Geo Coordinates',
  'ISP / Organization',
  'Screen & Viewport'
];

let hasEnsuredHeaders = false;

// Auto-initialize header row across columns A:Y (25 columns)
export const ensureSheetHeaders = async (sheetId: string, token: string) => {
  if (hasEnsuredHeaders) return;
  try {
    const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:Y1`;
    const checkRes = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (checkRes.ok) {
      const data = await checkRes.json();
      if (!data.values || data.values.length === 0 || !data.values[0] || data.values[0].length === 0) {
        const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:Y1?valueInputOption=USER_ENTERED`;
        await fetch(writeUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: [SHEET_HEADERS] })
        });
        console.log('[Tracker] 25-column table headers initialized in Google Sheet.');
      }
      hasEnsuredHeaders = true;
    }
  } catch (err) {
    console.warn('[Tracker] Header check bypassed:', err);
  }
};

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

export const logVisitorData = async (
  sheetId: string, 
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
      timeZone: env.timezone,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // 25 Structured Columns Matching SHEET_HEADERS exactly (A to Y)
    const enrichedRow = [
      formattedTimestamp,                                                      // A: Timestamp
      session.sessionId,                                                       // B: Session ID
      session.sessionDurationStr,                                              // C: Session Duration
      clickCount,                                                              // D: Click Count
      eventType,                                                               // E: Event Type
      actionDetails,                                                           // F: Action / Description
      targetElement,                                                           // G: Target Element
      contextUrl,                                                              // H: Page URL
      referral.referralSource,                                                 // I: Referral Source
      referral.referralMedium,                                                 // J: Referral Medium
      env.deviceType,                                                          // K: Device Type
      env.deviceBrandModel,                                                    // L: Device Model
      env.os,                                                                  // M: Operating System
      env.browser,                                                             // N: Browser
      `${env.cpuCores} | ${env.deviceMemory}`,                                 // O: CPU / Memory
      env.gpuRenderer,                                                         // P: GPU Hardware
      env.batteryStatus,                                                       // Q: Battery
      `${env.connectionType} (${env.networkDownlink}, ${env.networkRtt})`,    // R: Network Speed
      cachedGeo.ip,                                                            // S: IP Address
      cachedGeo.country,                                                       // T: Country
      cachedGeo.city,                                                          // U: City
      cachedGeo.region,                                                        // V: Region
      cachedGeo.coordinates,                                                   // W: Geo Coordinates (Lat, Lon)
      cachedGeo.isp,                                                           // X: ISP / Organization
      `${env.screenResolution} [${env.pixelRatio}]`                            // Y: Screen & Viewport
    ];

    const token = await getAccessToken();

    // 1. Direct browser-to-Sheets API
    if (token) {
      try {
        await ensureSheetHeaders(sheetId, token);
        const range = encodeURIComponent('Sheet1!A:Y');
        const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
        const res = await fetch(appendUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values: [enrichedRow] })
        });

        if (res.ok) {
          console.log(`[Tracker] Logged row [${session.sessionId}]: ${eventType}`);
          return;
        } else {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error?.message || `Sheets API status ${res.status}`;
          console.error('[Tracker] Sheets append error:', errMsg);
          toast.error('Google Sheets Error', { description: errMsg });
          return;
        }
      } catch (err: any) {
        console.error('[Tracker] Direct write failed:', err);
      }
    }

    // 2. Server proxy fallback
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sheetId,
        values: enrichedRow
      })
    }).catch(() => null);
  } catch (error: any) {
    console.debug('[Tracker] Logging skipped:', error?.message);
  }
};
