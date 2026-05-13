export type ConnectionStatus =
  | "Disconnected"
  | "Connecting"
  | "Connected"
  | "Disconnecting"
  | { Error: string };

export interface Server {
  id: string;
  city: string;
  country: string;
  flag: string;
  load: number;
}

export interface AppStatus {
  status: ConnectionStatus;
  serverId: string | null;
  publicIp: string | null;
  connectedAt: string | null;
  rxBytes: number;
  txBytes: number;
}

export function isConnected(s: ConnectionStatus): boolean {
  return s === "Connected";
}

export function isConnecting(s: ConnectionStatus): boolean {
  return s === "Connecting" || s === "Disconnecting";
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1073741824) return `${(b / 1048576).toFixed(1)} MB`;
  return `${(b / 1073741824).toFixed(2)} GB`;
}

export const DEFAULT_SERVERS: Server[] = [
  { id: "us-ny", city: "New York", country: "United States", flag: "🇺🇸", load: 44 },
  { id: "uk-lon", city: "London", country: "United Kingdom", flag: "🇬🇧", load: 31 },
  { id: "de-fra", city: "Frankfurt", country: "Germany", flag: "🇩🇪", load: 27 },
  { id: "nl-ams", city: "Amsterdam", country: "Netherlands", flag: "🇳🇱", load: 58 },
  { id: "sg-sin", city: "Singapore", country: "Singapore", flag: "🇸🇬", load: 62 },
  { id: "jp-tky", city: "Tokyo", country: "Japan", flag: "🇯🇵", load: 39 },
  { id: "ca-tor", city: "Toronto", country: "Canada", flag: "🇨🇦", load: 35 },
  { id: "au-syd", city: "Sydney", country: "Australia", flag: "🇦🇺", load: 22 },
  { id: "fr-par", city: "Paris", country: "France", flag: "🇫🇷", load: 47 },
  { id: "ch-zur", city: "Zurich", country: "Switzerland", flag: "🇨🇭", load: 19 },
];
