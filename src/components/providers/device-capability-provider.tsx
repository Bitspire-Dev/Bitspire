'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { detectDeviceCapability, type DeviceCapability } from '@/lib/device-capability';

const ServerCapability: DeviceCapability = {
  tier: 'high',
  isMobile: false,
  isTouch: false,
  isReducedMotion: false,
  saveData: false,
  effectiveConnectionType: null,
  pixelRatio: 1,
  hardwareConcurrency: 4,
  deviceMemory: 4,
};

const DeviceCapabilityContext = createContext<DeviceCapability>(ServerCapability);

/**
 * Provides a stable device-capability snapshot to the whole tree.
 *
 * Detection runs once on the client (in `useEffect`) so children read the SSR
 * fallback during the first render, then re-render once with the real client
 * value. The snapshot is intentionally not reactive — device capabilities
 * don't change during a session, and re-running detection would cause
 * cascading re-renders of every consumer.
 */
export function DeviceCapabilityProvider({ children }: { children: ReactNode }) {
  const [capability, setCapability] = useState<DeviceCapability | null>(null);

  useEffect(() => {
    setCapability(detectDeviceCapability());
  }, []);

  const value = capability ?? ServerCapability;

  return (
    <DeviceCapabilityContext.Provider value={value}>{children}</DeviceCapabilityContext.Provider>
  );
}

export function useDeviceCapability(): DeviceCapability {
  return useContext(DeviceCapabilityContext);
}

/**
 * Convenience selector — returns the tier directly. Components that only care
 * about the tier (most of them) can use this to avoid re-renders when other
 * capability fields change.
 */
export function useDeviceTier(): DeviceCapability['tier'] {
  return useContext(DeviceCapabilityContext).tier;
}
