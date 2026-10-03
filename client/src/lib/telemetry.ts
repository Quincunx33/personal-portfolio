// Advanced Visitor Telemetry Engine: Geo, Hardware, Battery, Network, Screen & Behavior

export interface HardwareAndEnvironment {
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  deviceBrandModel: string;
  os: string;
  browser: string;
  cpuCores: string;
  deviceMemory: string;
  gpuRenderer: string;
  screenResolution: string;
  colorDepth: string;
  pixelRatio: string;
  language: string;
  timezone: string;
  connectionType: string;
  networkDownlink: string;
  networkRtt: string;
  batteryStatus: string;
  colorScheme: 'Dark' | 'Light';
}

// Session initialization & duration tracking helper
const SESSION_STORAGE_KEY = 'tt_portfolio_session';
const SESSION_START_KEY = 'tt_portfolio_session_start';
const CLICK_COUNTER_KEY = 'tt_portfolio_clicks';

export function getOrCreateSession(): { 
  sessionId: string; 
  sessionDurationStr: string; 
  sessionDurationSeconds: number;
  clickCount: number;
} {
  let sessionId = '';
  let startTime = Date.now();
  let clickCount = 0;

  try {
    sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY) || '';
    const storedStart = sessionStorage.getItem(SESSION_START_KEY);
    clickCount = parseInt(sessionStorage.getItem(CLICK_COUNTER_KEY) || '0', 10);

    if (!sessionId || !storedStart) {
      sessionId = 'SESS-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      startTime = Date.now();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
      sessionStorage.setItem(SESSION_START_KEY, startTime.toString());
      sessionStorage.setItem(CLICK_COUNTER_KEY, '0');
    } else {
      startTime = parseInt(storedStart, 10) || Date.now();
    }
  } catch (e) {
    sessionId = 'SESS-ANON-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  const durationSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  const sessionDurationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return { sessionId, sessionDurationStr, sessionDurationSeconds: durationSeconds, clickCount };
}

export function incrementClickCount(): number {
  try {
    const current = parseInt(sessionStorage.getItem(CLICK_COUNTER_KEY) || '0', 10) + 1;
    sessionStorage.setItem(CLICK_COUNTER_KEY, current.toString());
    return current;
  } catch (e) {
    return 1;
  }
}

// Extract GPU renderer via WebGL without side effects
function getGpuRenderer(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Standard GPU';
      }
    }
  } catch (e) {}
  return 'Standard Graphics';
}

// Battery status helper
let cachedBattery = 'Not Supported';
if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
  (navigator as any).getBattery().then((battery: any) => {
    const update = () => {
      const level = Math.round(battery.level * 100);
      const charging = battery.charging ? ' (Charging)' : '';
      cachedBattery = `${level}%${charging}`;
    };
    update();
    battery.addEventListener('levelchange', update);
    battery.addEventListener('chargingchange', update);
  }).catch(() => {});
}

// Deep client hardware & environment inspection
export function parseClientEnvironment(): HardwareAndEnvironment {
  const ua = window.navigator.userAgent;
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  let deviceBrandModel = 'Generic Device';

  if (/iPad|tablet|(android(?!.*mobile))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // Model heuristics
  if (/iPhone/i.test(ua)) deviceBrandModel = 'Apple iPhone';
  else if (/iPad/i.test(ua)) deviceBrandModel = 'Apple iPad';
  else if (/Macintosh|Mac OS X/i.test(ua)) deviceBrandModel = 'Apple Mac';
  else if (/SM-[A-Z0-9]+/i.test(ua)) deviceBrandModel = ua.match(/SM-[A-Z0-9]+/i)?.[0] || 'Samsung Galaxy';
  else if (/Pixel/i.test(ua)) deviceBrandModel = ua.match(/Pixel [A-Za-z0-9 ]+/i)?.[0] || 'Google Pixel';
  else if (/Windows/i.test(ua)) deviceBrandModel = 'Windows PC';
  else if (/Linux/i.test(ua)) deviceBrandModel = 'Linux Machine';

  // Operating system
  let os = 'Unknown OS';
  if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT 6.3/i.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6.1/i.test(ua)) os = 'Windows 7';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Unknown Browser';
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/OPR\/|Opera\//i.test(ua)) browser = 'Opera';
  else if (/Chrome\//i.test(ua)) browser = 'Google Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox';

  // CPU cores & RAM
  const navAny = navigator as any;
  const cpuCores = navAny.hardwareConcurrency ? `${navAny.hardwareConcurrency} Cores` : 'Unknown';
  const deviceMemory = navAny.deviceMemory ? `${navAny.deviceMemory} GB RAM` : 'Unknown';

  // Network metrics
  const connectionType = navAny.connection?.effectiveType 
    ? navAny.connection.effectiveType.toUpperCase()
    : 'Broadband/WiFi';
  const networkDownlink = navAny.connection?.downlink 
    ? `${navAny.connection.downlink} Mbps`
    : 'Unknown';
  const networkRtt = navAny.connection?.rtt 
    ? `${navAny.connection.rtt} ms`
    : 'Unknown';

  // Preferred color scheme
  const colorScheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'Dark'
    : 'Light';

  return {
    deviceType,
    deviceBrandModel,
    os,
    browser,
    cpuCores,
    deviceMemory,
    gpuRenderer: getGpuRenderer(),
    screenResolution: `${window.screen.width}x${window.screen.height} (Viewport: ${window.innerWidth}x${window.innerHeight})`,
    colorDepth: `${window.screen.colorDepth}-bit`,
    pixelRatio: `${window.devicePixelRatio || 1}x`,
    language: navigator.language || 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    connectionType,
    networkDownlink,
    networkRtt,
    batteryStatus: cachedBattery,
    colorScheme
  };
}

// Deep referral intelligence
export function parseReferralSource(): {
  referralSource: string;
  referralMedium: string;
  landingPage: string;
} {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');

    if (utmSource) {
      return {
        referralSource: utmSource,
        referralMedium: utmMedium || 'Campaign / Ad',
        landingPage: window.location.pathname
      };
    }

    const ref = document.referrer;
    if (!ref) {
      return {
        referralSource: 'Direct / Bookmark',
        referralMedium: 'Direct Traffic',
        landingPage: window.location.pathname
      };
    }

    const parsedRef = new URL(ref);
    const hostname = parsedRef.hostname.toLowerCase();

    if (hostname.includes('google.')) return { referralSource: 'Google Search', referralMedium: 'Organic Search', landingPage: window.location.pathname };
    if (hostname.includes('bing.')) return { referralSource: 'Bing Search', referralMedium: 'Organic Search', landingPage: window.location.pathname };
    if (hostname.includes('duckduckgo.')) return { referralSource: 'DuckDuckGo', referralMedium: 'Organic Search', landingPage: window.location.pathname };
    if (hostname.includes('github.com')) return { referralSource: 'GitHub Profile / Repo', referralMedium: 'Developer Social', landingPage: window.location.pathname };
    if (hostname.includes('linkedin.com')) return { referralSource: 'LinkedIn', referralMedium: 'Professional Social', landingPage: window.location.pathname };
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return { referralSource: 'Twitter / X', referralMedium: 'Social', landingPage: window.location.pathname };
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return { referralSource: 'Facebook', referralMedium: 'Social', landingPage: window.location.pathname };
    if (hostname.includes('instagram.com')) return { referralSource: 'Instagram', referralMedium: 'Social', landingPage: window.location.pathname };
    if (hostname.includes('youtube.com')) return { referralSource: 'YouTube', referralMedium: 'Video Referral', landingPage: window.location.pathname };

    if (hostname === window.location.hostname.toLowerCase()) {
      return { referralSource: 'Internal Navigation', referralMedium: 'Internal Link', landingPage: window.location.pathname };
    }

    return { referralSource: hostname, referralMedium: 'External Referral', landingPage: window.location.pathname };
  } catch (e) {
    return { referralSource: 'Direct / Unknown', referralMedium: 'Direct Traffic', landingPage: window.location.pathname };
  }
}

// IP, Coordinates, Postal & ISP intelligence
export async function resolveGeoIp(): Promise<{
  ip: string;
  country: string;
  city: string;
  region: string;
  postal: string;
  coordinates: string;
  isp: string;
  timezone: string;
}> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      const lat = data.latitude ? data.latitude.toFixed(4) : '';
      const lon = data.longitude ? data.longitude.toFixed(4) : '';
      return {
        ip: data.ip || 'Unknown',
        country: data.country_name ? `${data.country_name} (${data.country_code})` : 'Unknown',
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        postal: data.postal || 'N/A',
        coordinates: lat && lon ? `${lat}, ${lon}` : 'N/A',
        isp: data.org || data.asn || 'Unknown ISP',
        timezone: data.timezone || 'UTC'
      };
    }
  } catch (e) {
    try {
      const res2 = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3000) });
      if (res2.ok) {
        const data2 = await res2.json();
        const lat = data2.latitude ? data2.latitude.toFixed(4) : '';
        const lon = data2.longitude ? data2.longitude.toFixed(4) : '';
        return {
          ip: data2.ip || 'Unknown',
          country: data2.country ? `${data2.country} (${data2.country_code})` : 'Unknown',
          city: data2.city || 'Unknown',
          region: data2.region || 'Unknown',
          postal: data2.postal || 'N/A',
          coordinates: lat && lon ? `${lat}, ${lon}` : 'N/A',
          isp: data2.connection?.isp || 'Unknown ISP',
          timezone: data2.timezone?.id || 'UTC'
        };
      }
    } catch (e2) {}
  }

  return {
    ip: 'Unknown IP',
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    postal: 'N/A',
    coordinates: 'N/A',
    isp: 'Unknown ISP',
    timezone: 'UTC'
  };
}
