import { useEffect, useRef } from 'react';
import { logVisitorData, ClickMetadata } from '../lib/tracker';
import { getSessionInfo } from '../lib/telemetry';

// Global variable to ensure Page View fires ONLY ONCE across component lifecycles & mounts
let globalPageViewLogged = false;

export const useTracker = (_sheetId = 'portfolio') => {
  const hasLoggedPageView = useRef(false);

  useEffect(() => {
    // 1. Initial Page View Tracking (Guaranteed strictly once per browser session/page load)
    if (!hasLoggedPageView.current && !globalPageViewLogged) {
      globalPageViewLogged = true;
      hasLoggedPageView.current = true;

      logVisitorData(
        _sheetId,
        'Page View',
        `Visited portfolio: "${document.title || 'Tasfiya Tabassum'}"`,
        'Viewport / Main Entry',
        window.location.href,
        false
      );
    }

    // 2. Strict Real User Click Tracking
    const handleGlobalClick = (event: MouseEvent) => {
      try {
        // Ignore synthetic, non-user events
        if (event.isTrusted === false) return;

        const target = event.target as HTMLElement;
        if (!target) return;

        // Extract real element tag
        const targetTag = (target.tagName || 'DIV').toLowerCase();

        // Extract class names safely
        let targetClasses = '';
        if (typeof target.className === 'string') {
          targetClasses = target.className.trim();
        } else if (typeof target.className === 'object' && target.className !== null && 'baseVal' in target.className) {
          targetClasses = (target.className as any).baseVal || '';
        }

        // Extract text content cleanly
        const rawText = target.innerText || target.textContent || '';
        const targetText = rawText.trim().replace(/\s+/g, ' ').slice(0, 60);

        // Check if user clicked an interactive element or inside one
        const interactiveAncestor = target.closest('a, button, [role="button"], input, textarea, select');
        const link = (interactiveAncestor as HTMLAnchorElement)?.href || (target as HTMLAnchorElement)?.href || '';
        const targetId = target.id ? `#${target.id}` : '';

        let actionDescription = '';
        if (link) {
          if (link.includes('github.com')) {
            actionDescription = `GitHub Link (${link})`;
          } else if (link.includes('linkedin.com')) {
            actionDescription = `LinkedIn Link (${link})`;
          } else if (link.startsWith('mailto:')) {
            actionDescription = `Email Link (${link})`;
          } else {
            actionDescription = `Link Click (${link})`;
          }
        } else if (targetTag === 'button' || interactiveAncestor?.tagName?.toLowerCase() === 'button') {
          actionDescription = `Button Click ("${targetText || 'Button'}")`;
        } else {
          actionDescription = `Clicked <${targetTag}> ("${targetText.slice(0, 30) || targetId || 'Element'}")`;
        }

        const clickMeta: ClickMetadata = {
          tagName: targetTag,
          className: targetClasses || '',
          textContent: targetText || '',
          id: target.id || undefined,
          role: target.getAttribute('role') || undefined,
          href: link || undefined,
        };

        const targetIdentifier = `<${targetTag}${targetId ? ` ${targetId}` : ''}>`;

        // Send metadata to Telegram immediately
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

    // 3. User Exit Tracking
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

    // Attach click listener globally to document using capture phase
    document.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [_sheetId]);
};
