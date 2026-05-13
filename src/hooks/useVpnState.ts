import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusResponse, isConnected } from "../types";

const defaultStatus: StatusResponse = {
  status: "Disconnected",
  serverName: null,
  publicIp: null,
  connectedAt: null,
  rxBytes: 0,
  txBytes: 0,
};

export function useVpnState() {
  const [status, setStatus] = useState<StatusResponse>(defaultStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const s = await invoke<StatusResponse>("get_status");
      setStatus(s);
    } catch (e) {
      console.error("get_status failed", e);
    }
  }, []);

  // Poll every 2s while connected
  useEffect(() => {
    if (isConnected(status.status)) {
      pollRef.current = setInterval(refresh, 2000);
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [status.status, refresh]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await invoke("connect_vpn");
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

  const importConfig = useCallback(async () => {
    setError(null);
    try {
      const path = await open({
        multiple: false,
        filters: [{ name: "WireGuard Config", extensions: ["conf"] }],
      });
      if (!path) return;

      await invoke("import_config", { path });
      await refresh();
    } catch (e) {
      setError(String(e));
    }
  }, [refresh]);

  return { status, loading, error, connect, disconnect, importConfig };
}
