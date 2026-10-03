import { useEffect, useRef } from 'react';
import { logVisitorData } from '../lib/tracker';
import { getOrCreateSession } from '../lib/telemetry';

export const useTracker = (sheetId: string) => {
  const hasLoggedPageView = useRef(false);

  useEffect(() => {
    // 1. Initial Page View
    if (!hasLoggedPageView.current) {
      logVisitorData(
        sheetId, 
        'Page View', 
        `Visited portfolio landing: "${document.title || 'Tasfiya Tabassum'}"`, 
        'Viewport / Main Entry',
        window.location.href,
        false
      );
      hasLoggedPageView.current = true;
    }

    // 2. Click tracking with cumulative click counter
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest('button, a, [role="button"], .project-card, .tab-btn, input, textarea');
      const elementToTrack = interactiveEl || target;

      const tagName = elementToTrack.tagName.toLowerCase();
      const text = (elementToTrack.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      const link = (elementToTrack as HTMLAnchorElement).href || '';
      const id = elementToTrack.id || '';
      const className = typeof elementToTrack.className === 'string' ? elementToTrack.className.slice(0, 50) : '';

      let eventCategory = 'User Click';
      let actionDetails = `Clicked <${tagName}> "${text}"`;

      if (link) {
        if (link.includes('github.com')) {
          eventCategory = 'GitHub Repo Inspection';
          actionDetails = `Opened GitHub repository: ${link}`;
        } else if (link.startsWith('http') && !link.includes(window.location.host)) {
          eventCategory = 'Outbound External Link';
          actionDetails = `Visited external link: ${link}`;
        } else {
          eventCategory = 'Internal Anchor Navigation';
          actionDetails = `Navigated to anchor/route: ${link}`;
        }
      } else if (tagName === 'button') {
        eventCategory = 'Button Action';
        actionDetails = `Triggered button: "${text || id || 'Action'}"`;
      }

      const targetIdentifier = `<${tagName}>${id ? ` #${id}` : ''}${className ? ` .${className.split(' ')[0]}` : ''}`;

      logVisitorData(
        sheetId,
        eventCategory,
        actionDetails,
        targetIdentifier,
        window.location.href,
        true // isClickEvent = true
      );
    };

    // 3. User exit tracking
    const handleBeforeUnload = () => {
      const session = getOrCreateSession();
      if (session.sessionDurationSeconds >= 2) {
        logVisitorData(
          sheetId,
          'Session Ended',
          `User exited after spending ${session.sessionDurationStr} (Total Clicks: ${session.clickCount})`,
          'Window / Unload',
          window.location.href,
          false
        );
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sheetId]);
};
