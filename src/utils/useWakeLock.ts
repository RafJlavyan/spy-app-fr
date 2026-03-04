import { useState, useCallback, useEffect } from "react";

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<any>(null);

  const requestWakeLock = useCallback(async () => {
    if ("wakeLock" in navigator) {
      try {
        const lock = await (navigator as any).wakeLock.request("screen");
        setWakeLock(lock);

        lock.addEventListener("release", () => {
          setWakeLock(null);
        });
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  }, [wakeLock]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (wakeLock !== null && document.visibilityState === "visible") {
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLock) releaseWakeLock();
    };
  }, [wakeLock, requestWakeLock, releaseWakeLock]);

  return {
    requestWakeLock,
    releaseWakeLock,
    isSupported: "wakeLock" in navigator,
  };
};
