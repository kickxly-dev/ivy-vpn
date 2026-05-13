import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppStatus, isConnected } from "../types";

const defaultStatus: AppStatus = {
  status: "Disconnected",
  serverId: null,
  publicIp: null,
  connectedAt: null,
  rxBytes: 0,
  txBytes: 0,
};

export function useVpnState() {
  const [appStatus, setAppStatus] = useState<AppStatus>(defaultStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const s = await invoke<AppStatus>("get_status");
      setAppStatus(s);
    } catch {}
  }, []);

  useEffect(() => {
    if (isConnected(appStatus.status)) {
      pollRef.current = setInterval(refresh, 3000);
    } else {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [appStatus.status, refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  const connect = useCallback(async (serverId: string) => {
    setLoading(true);
    setError(null);
    try {
      await invoke("connect_vpn", { serverId });
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const disconnect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await invoke("disconnect_vpn");
      await refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  return { appStatus, loading, error, connect, disconnect };
}
