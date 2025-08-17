export {};

const _fetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const res = await _fetch(...(args as [RequestInfo, RequestInit?]));
    if (!res.ok) {
      console.warn('[fetch]', args[0], res.status, res.statusText, Object.fromEntries(res.headers.entries()));
    }
    return res;
  } catch (e) {
    console.error('[fetch] network error', args[0], e);
    throw e;
  }
};

window.addEventListener('unhandledrejection', (e) => console.error('[unhandledrejection]', e.reason));
window.addEventListener('error', (e) =>
  console.error('[window.error]', (e as ErrorEvent).error || (e as ErrorEvent).message),
);
