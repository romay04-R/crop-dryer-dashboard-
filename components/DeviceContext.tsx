"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface DeviceContextValue {
  deviceId: string;
  setDeviceId: (id: string) => void;
}

const DeviceContext = createContext<DeviceContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "cropdryer.deviceId";

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [deviceId, setDeviceIdState] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setDeviceIdState(stored);
    } catch {
      // localStorage unavailable, fall back to session-only state
    }
  }, []);

  function setDeviceId(id: string) {
    setDeviceIdState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore persistence failure
    }
  }

  return (
    <DeviceContext.Provider value={{ deviceId, setDeviceId }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDevice must be used within DeviceProvider");
  return ctx;
}
