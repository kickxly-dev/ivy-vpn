export type TunnelStatus =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | { Error: string };

export interface VpnConfig {
  name: string;
  address: string;
  endpoint: string;
  allowedIps: string;
  dns?: string;
}

export interface StatusResponse {
  status: TunnelStatus;
  serverName: string | null;
  publicIp: string | null;
  connectedAt: string | null;
  rxBytes: number;
  txBytes: number;
}

export function statusLabel(s: TunnelStatus): string {
  if (s === "Connected") return "CONNECTED";
  if (s === "Connecting") return "CONNECTING";
  if (s === "Disconnected") return "DISCONNECTED";
  return "ERROR";
}

export function isConnected(s: TunnelStatus): boolean {
  return s === "Connected";
}

export function isConnecting(s: TunnelStatus): boolean {
  return s === "Connecting";
}

export function isDisconnected(s: TunnelStatus): boolean {
  return s === "Disconnected";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
