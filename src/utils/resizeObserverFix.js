/**
 * DEFINITIVE RESIZE OBSERVER FIX
 *
 * Strategy: replace window.ResizeObserver with a version whose callback
 * is ALWAYS deferred via requestAnimationFrame. When the callback runs
 * inside rAF the browser never fires the "loop" notification, so the
 * error is never created — CRA's handleError never gets a chance to show
 * the overlay because there is nothing to show.
 *
 * Secondary belt-and-suspenders: suppress it at every other layer too
 * (console, window error event, CRA overlay DOM node) so that even if
 * something else triggers it we are covered.
 */

const RESIZE_OBSERVER_MSGS = [
  "ResizeObserver loop completed with undelivered notifications",
  "ResizeObserver loop limit exceeded",
  "ResizeObserver observer loop limit exceeded",
  "ResizeObserver loop completed",
];

const isROError = (msg) =>
  typeof msg === "string" && RESIZE_OBSERVER_MSGS.some((m) => msg.includes(m));

const noop = () => {};

/* ─── 1. Replace ResizeObserver (PRIMARY fix) ──────────────────────────────── */
const replaceResizeObserver = () => {
  if (typeof window === "undefined") return;
  if (!window.ResizeObserver) return;
  if (window.ResizeObserver.__ro_fixed) return;

  const NativeRO = window.ResizeObserver;

  window.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this._pending = null;
      this._inner = new NativeRO((entries, observer) => {
        // Cancel any previously scheduled call so we only fire once per frame
        if (this._pending !== null) cancelAnimationFrame(this._pending);
        this._pending = requestAnimationFrame(() => {
          this._pending = null;
          try {
            callback(entries, observer);
          } catch (e) {
            if (!isROError(e?.message)) throw e;
          }
        });
      });
    }

    observe(target, options) {
      try {
        this._inner.observe(target, options);
      } catch (_) {}
    }
    unobserve(target) {
      try {
        this._inner.unobserve(target);
      } catch (_) {}
    }
    disconnect() {
      if (this._pending !== null) {
        cancelAnimationFrame(this._pending);
        this._pending = null;
      }
      try {
        this._inner.disconnect();
      } catch (_) {}
    }
  };

  window.ResizeObserver.__ro_fixed = true;
};

/* ─── 2. Silence console.error / console.warn ──────────────────────────────── */
const _origError = console.error.bind(console);
const _origWarn = console.warn.bind(console);

const silenceConsole = () => {
  console.error = (...a) => {
    if (!isROError(a.join(" "))) _origError(...a);
  };
  console.warn = (...a) => {
    if (!isROError(a.join(" "))) _origWarn(...a);
  };
};

/* ─── 3. Swallow the window 'error' event (capture phase) ─────────────────── */
const onWindowError = (e) => {
  if (isROError(e?.message || e?.error?.message)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
};

/* ─── 4. Nuke the CRA / webpack-dev-server overlay DOM node ────────────────── */
const OVERLAY_SELECTORS = [
  "iframe#webpack-dev-server-client-overlay",
  "div#webpack-dev-server-client-overlay",
  'body > iframe[src="about:blank"]',
];

let _overlayObserver = null;
let _roErrorPending = false;
let _pendingTimer = null;

const markROErrorPending = () => {
  _roErrorPending = true;
  clearTimeout(_pendingTimer);
  _pendingTimer = setTimeout(() => {
    _roErrorPending = false;
  }, 1000);
};

const nukeOverlayIfRO = () => {
  if (!_roErrorPending) return;
  OVERLAY_SELECTORS.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      const hint = el.getAttribute("title") || el.getAttribute("srcdoc") || "";
      if (!hint || isROError(hint)) el.remove();
    });
  });
};

const watchForOverlay = () => {
  if (typeof window === "undefined" || !window.MutationObserver) return;
  if (_overlayObserver) return;

  window.addEventListener(
    "error",
    (e) => {
      if (isROError(e?.message || e?.error?.message)) markROErrorPending();
    },
    true,
  );

  _overlayObserver = new MutationObserver(nukeOverlayIfRO);
  _overlayObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};

/* ─── 5. Public API ─────────────────────────────────────────────────────────── */
let _initialized = false;

export const suppressResizeObserverErrors = () => {
  if (typeof window === "undefined" || _initialized) return noop;

  replaceResizeObserver(); // PRIMARY – stops the error at its source
  silenceConsole();
  watchForOverlay();

  window.addEventListener("error", onWindowError, true);
  window.addEventListener("unhandledrejection", (e) => {
    if (isROError(e?.reason?.message || String(e?.reason ?? "")))
      e.preventDefault();
  });

  _initialized = true;

  return () => {
    window.removeEventListener("error", onWindowError, true);
    console.error = _origError;
    console.warn = _origWarn;
    _initialized = false;
  };
};

export const unsuppressResizeObserverErrors = () => {
  console.error = _origError;
  console.warn = _origWarn;
  window.removeEventListener("error", onWindowError, true);
  _initialized = false;
};

// ─── Auto-execute immediately when the module is imported ───────────────────
suppressResizeObserverErrors();

// Removed the development console log
