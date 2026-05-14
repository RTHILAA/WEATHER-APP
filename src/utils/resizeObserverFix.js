// src/utils/resizeObserverFix.js

/**
 * COMPLETE RESIZE OBSERVER ERROR FIX
 * This eliminates the benign ResizeObserver errors in all browsers
 */

let originalConsoleError = null;
let isPatched = false;

// The error messages to filter
const ERROR_MESSAGES = [
    'ResizeObserver loop completed with undelivered notifications.',
    'ResizeObserver loop limit exceeded',
    'ResizeObserver observer loop limit exceeded'
];

// Check if error message matches any ResizeObserver error
const isResizeObserverError = (message) => {
    if (!message) return false;
    return ERROR_MESSAGES.some(errMsg => message.includes(errMsg));
};

// Handler for window errors
const errorHandler = (event) => {
    const message = event?.message || event?.reason?.message || '';
    
    if (isResizeObserverError(message)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
};

// Handler for unhandled rejections
const rejectionHandler = (event) => {
    const message = event?.reason?.message || event?.reason || '';
    
    if (isResizeObserverError(message)) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
};

// Monkey patch console.error to filter the error
const patchConsoleError = () => {
    if (originalConsoleError) return;
    
    originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (isResizeObserverError(message)) {
            return; // Silently suppress
        }
        return originalConsoleError.apply(this, args);
    };
};

// Restore original console.error
const restoreConsoleError = () => {
    if (originalConsoleError) {
        console.error = originalConsoleError;
        originalConsoleError = null;
    }
};

// Override ResizeObserver to catch errors at source
const patchResizeObserver = () => {
    if (typeof window === 'undefined' || !window.ResizeObserver) return;
    
    // Prevent double patching
    if (window.ResizeObserver.__patched) return;
    
    const OriginalResizeObserver = window.ResizeObserver;
    
    window.ResizeObserver = class PatchedResizeObserver extends OriginalResizeObserver {
        constructor(callback) {
            // Wrap callback to catch errors
            const wrappedCallback = (entries, observer) => {
                try {
                    callback(entries, observer);
                } catch (error) {
                    if (!isResizeObserverError(error?.message)) {
                        throw error;
                    }
                    // Swallow ResizeObserver errors silently
                }
            };
            super(wrappedCallback);
        }
    };
    
    // Copy static properties
    Object.setPrototypeOf(window.ResizeObserver, OriginalResizeObserver);
    window.ResizeObserver.__patched = true;
};

// Also patch for React 18+ concurrent features
const patchReactResizeObserver = () => {
    if (typeof window === 'undefined') return;
    
    // Intercept potential React internal ResizeObserver usage
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRequestAnimationFrame.call(this, (...args) => {
            try {
                return callback(...args);
            } catch (error) {
                if (!isResizeObserverError(error?.message)) {
                    throw error;
                }
            }
        });
    };
};

/**
 * Enable full suppression of ResizeObserver errors
 */
export const suppressResizeObserverErrors = () => {
    if (typeof window === 'undefined') return;
    if (isPatched) return;
    
    // 1. Patch console.error
    patchConsoleError();
    
    // 2. Add error event listener (capture phase to catch early)
    window.addEventListener('error', errorHandler, true);
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    // 3. Patch ResizeObserver at source
    patchResizeObserver();
    
    // 4. Patch requestAnimationFrame for React
    patchReactResizeObserver();
    
    isPatched = true;
};

/**
 * Disable suppression (for testing)
 */
export const unsuppressResizeObserverErrors = () => {
    if (typeof window === 'undefined') return;
    
    restoreConsoleError();
    window.removeEventListener('error', errorHandler, true);
    window.removeEventListener('unhandledrejection', rejectionHandler);
    isPatched = false;
};

// Auto-execute immediately when imported
suppressResizeObserverErrors();