"use client";

export const SESSION_EXPIRED_EVENT = "llj:session-expired";

export interface SessionExpiredDetail {
  reason?: string;
  expiredAt?: number;
}

/**
 * Dispatches an event notifying the admin layout and application
 * that the user session has expired or been revoked.
 */
export function notifySessionExpired(reason: string = "expired"): void {
  if (typeof window === "undefined") return;

  const event = new CustomEvent<SessionExpiredDetail>(SESSION_EXPIRED_EVENT, {
    detail: { reason, expiredAt: Date.now() },
  });

  window.dispatchEvent(event);
}

/**
 * Subscribes to the global session expired event.
 */
export function onSessionExpired(
  callback: (detail: SessionExpiredDetail) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<SessionExpiredDetail>;
    callback(customEvent.detail || {});
  };

  window.addEventListener(SESSION_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
}

/**
 * Enhanced fetch wrapper for admin requests that automatically triggers
 * session expiration flow if any request returns HTTP 401 Unauthorized.
 */
export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    notifySessionExpired("unauthorized_response");
  }

  return response;
}
