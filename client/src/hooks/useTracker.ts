import { useEffect, useRef } from 'react';
import {
  trackPageView,
  trackScrollMilestone,
  trackEngagementMilestone,
  trackClipboardCopy,
  trackTabFocusChange,
  logVisitorData,
  ClickMetadata
} from '../lib/tracker';
import { getSessionInfo } from '../lib/telemetry';

// Global variable to ensure Page View fires ONLY ONCE across component lifecycles & mounts
let globalPageViewLogged = false;

export const useTracker = (_sheetId = 'portfolio') => {
  const hasLoggedPageView = useRef(false);
  const scrollMilestonesReached = useRef<Set<number>>(new Set());
  const engagementMilestonesReached = useRef<Set<number>>(new Set());
  const blurTimestampRef = useRef<number>(0);
  const lastClickTimeRef = useRef<number>(0);

  useEffect(() => {
    // 1. Initial Page View Tracking (Guaranteed strictly once per browser session/page load)
    if (!hasLoggedPageView.current && !globalPageViewLogged) {
      globalPageViewLogged = true;
      hasLoggedPageView.current = true;
      trackPageView(document.title || 'Tasfiya Tabassum Portfolio');
    }

    // 2. Scroll Depth Milestones (25%, 50%, 75%, 100%)
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        try {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight <= 0) return;
          const currentScroll = window.scrollY || window.pageYOffset;
          const percent = Math.min(100, Math.round((currentScroll / docHeight) * 100));

          const milestones = [25, 50, 75, 100];
          for (const m of milestones) {
            if (percent >= m && !scrollMilestonesReached.current.has(m)) {
              scrollMilestonesReached.current.add(m);
              trackScrollMilestone(m);
            }
          }
        } catch {}
      }, 300);
    };

    // 3. Engagement Milestones (30 seconds, 2 minutes, 5 minutes)
    const engagementTimes = [30, 120, 300];
    const timers = engagementTimes.map((secs) => {
      return setTimeout(() => {
        if (!engagementMilestonesReached.current.has(secs) && !document.hidden) {
          engagementMilestonesReached.current.add(secs);
          trackEngagementMilestone(secs);
        }
      }, secs * 1000);
    });

    // 4. Tab Visibility Attention Tracking
    const handleVisibilityChange = () => {
      try {
        if (document.hidden) {
          blurTimestampRef.current = Date.now();
          trackTabFocusChange('hidden');
        } else {
          const awayDuration = blurTimestampRef.current > 0
            ? Math.round((Date.now() - blurTimestampRef.current) / 1000)
            : 0;
          blurTimestampRef.current = 0;
          trackTabFocusChange('visible', awayDuration);
        }
      } catch {}
    };

    // 5. Clipboard Selection & Copy Listener
    const handleCopy = () => {
      try {
        const selection = window.getSelection();
        const text = selection ? selection.toString() : '';
        if (text && text.trim().length > 1) {
          trackClipboardCopy(text.trim());
        }
      } catch {}
    };

    // 6. Strict High-Intent Real User Click Tracking
    const handleGlobalClick = (event: MouseEvent) => {
      try {
        if (event.isTrusted === false) return;

        const now = Date.now();
        // Prevent high-frequency multi-clicks within 600ms
        if (now - lastClickTimeRef.current < 600) return;

        const target = event.target as HTMLElement;
        if (!target) return;

        // Check if user clicked an interactive element or inside one
        const interactiveAncestor = target.closest('a, button, [role="button"], input, textarea, select, details, summary');
        const targetElement = (interactiveAncestor || target) as HTMLElement;
        const targetTag = targetElement.tagName.toLowerCase();

        // If clicking generic empty background without interactive role, skip spam
        const isInteractive = Boolean(
          interactiveAncestor ||
          targetTag === 'button' ||
          targetTag === 'a' ||
          targetTag === 'input' ||
          targetElement.onclick !== null ||
          targetElement.hasAttribute('role') ||
          targetElement.classList.contains('cursor-pointer') ||
          targetElement.closest('.signal-button, .text-button, .filter, .brand, .top-github, .bento-card')
        );

        if (!isInteractive && targetTag === 'div' && !target.innerText?.trim()) {
          return;
        }

        lastClickTimeRef.current = now;

        // Extract class names safely
        let targetClasses = '';
        if (typeof targetElement.className === 'string') {
          targetClasses = targetElement.className.trim();
        } else if (typeof targetElement.className === 'object' && targetElement.className !== null && 'baseVal' in targetElement.className) {
          targetClasses = (targetElement.className as any).baseVal || '';
        }

        const rawText = targetElement.innerText || targetElement.textContent || '';
        const targetText = rawText.trim().replace(/\s+/g, ' ').slice(0, 50);

        const link = (targetElement as HTMLAnchorElement)?.href || (target as HTMLAnchorElement)?.href || '';
        const targetId = targetElement.id ? `#${targetElement.id}` : '';

        let actionDescription = '';
        if (link) {
          if (link.includes('github.com')) {
            actionDescription = `GitHub Outbound (${link.replace('https://github.com/', '')})`;
          } else if (link.includes('instagram.com') || link.includes('facebook.com')) {
            actionDescription = `Social Outbound Link (${link})`;
          } else if (link.startsWith('mailto:')) {
            actionDescription = `Email Link (${link})`;
          } else {
            actionDescription = `Outbound Link (${link})`;
          }
        } else if (targetTag === 'button') {
          actionDescription = `Button Click ("${targetText || 'Interactive Button'}")`;
        } else {
          actionDescription = `Clicked <${targetTag}> ("${targetText.slice(0, 30) || targetId || 'Element'}")`;
        }

        const clickMeta: ClickMetadata = {
          tagName: targetTag,
          className: targetClasses || '',
          textContent: targetText || '',
          id: targetElement.id || undefined,
          role: targetElement.getAttribute('role') || undefined,
          href: link || undefined,
        };

        const targetIdentifier = `<${targetTag}${targetId ? ` ${targetId}` : ''}>`;

        logVisitorData(
          _sheetId,
          'User Click',
          actionDescription,
          targetIdentifier,
          window.location.href,
          true,
          clickMeta
        );
      } catch (err) {
        console.error('[useTracker] Click error:', err);
      }
    };

    // 7. User Exit Tracking
    const handleBeforeUnload = () => {
      try {
        const session = getSessionInfo();
        logVisitorData(
          _sheetId,
          'Session Ended',
          `Visitor exited portfolio after ${session.sessionDuration}`,
          'Window / Unload',
          window.location.href,
          false
        );
      } catch (e) {}
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [_sheetId]);
};
