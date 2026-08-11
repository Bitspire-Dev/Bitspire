export function canPrefetchInBackground() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const connection = (
    navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        saveData?: boolean;
      };
    }
  ).connection;

  if (!connection) {
    return true;
  }

  if (connection.saveData) {
    return false;
  }

  return !/(^|slow-)2g/.test(connection.effectiveType ?? '');
}

export function schedulePageIdleTask(
  task: () => void,
  options: {
    timeout?: number;
    fallbackDelay?: number;
  } = {}
) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const { timeout = 4000, fallbackDelay = 1200 } = options;
  let idleId: number | null = null;
  let timeoutId: number | null = null;

  const runTask = () => {
    const requestIdle = (
      window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      }
    ).requestIdleCallback;

    if (requestIdle) {
      idleId = requestIdle(task, { timeout });
      return;
    }

    timeoutId = window.setTimeout(task, fallbackDelay);
  };

  if (document.readyState === 'complete') {
    runTask();
  } else {
    window.addEventListener('load', runTask, { once: true });
  }

  return () => {
    window.removeEventListener('load', runTask);

    if (idleId !== null) {
      (
        window as Window & {
          cancelIdleCallback?: (id: number) => void;
        }
      ).cancelIdleCallback?.(idleId);
    }

    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  };
}