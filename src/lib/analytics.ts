/**
 * NoteNest Privacy-Friendly Analytics Utility
 * Supports Vercel Web Analytics, custom events, and Google Analytics without PII.
 */

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  // 1. Log in development for audit
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${eventName}:`, properties || {});
  }

  // 2. Safe pass-through to window.va (Vercel Analytics) if loaded
  try {
    if ((window as any).va) {
      (window as any).va('event', { name: eventName, data: properties });
    }
  } catch (err) {
    // Silent fail
  }

  // 3. Safe pass-through to gtag (Google Analytics) if loaded
  try {
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  } catch (err) {
    // Silent fail
  }
};

export const trackNoteDownload = (noteTitle: string, courseCode: string, subject: string) => {
  trackEvent('note_download', {
    title: noteTitle,
    course_code: courseCode,
    subject,
    timestamp: new Date().toISOString(),
  });
};

export const trackSearch = (query: string, resultCount: number) => {
  if (!query || query.trim().length < 2) return;
  trackEvent('search_query', {
    query: query.trim().toLowerCase(),
    results: resultCount,
  });
};

export const trackCategoryView = (category: string) => {
  trackEvent('category_view', { category });
};

