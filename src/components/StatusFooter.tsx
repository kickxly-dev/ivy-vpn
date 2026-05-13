import { ConnectionStatus, formatBytes, isConnected } from "../types";
import { useConnectionTimer } from "../hooks/useConnectionTimer";

interface Props {
  status: ConnectionStatus;
  publicIp: string | null;
  connectedAt: string | null;
  rxBytes: number;
  txBytes: number;
  error: string | null;
}

export function StatusFooter({ status, publicIp, connectedAt, rxBytes, txBytes, error }: Props) {
  const timer = useConnectionTimer(connectedAt);
  const connected = isConnected(status);

  const statusText =
    status === "Connecting" ? "Establishing tunnel…"
    : status === "Disconnecting" ? "Disconnecting…"
    : connected ? "Protected"
    : "Not protected";

  const statusColor = connected ? "var(--green)" : "var(--text-3)";

  return (
    <div style={{
      padding: "16px 20px 20px",
      borderTop: "1px solid var(--border)",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      {/* Status line */}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span
          style={{
            width: 5, height: 5,
            borderRadius: "50%",
            background: statusColor,
            flexShrink: 0,
            boxShadow: connected ? `0 0 5px var(--green)` : "none",
            transition: "background 0.3s, box-shadow 0.3s",
          }}
        />
        <span style={{ fontSize: 12, color: statusColor, transition: "color 0.3s" }}>
          {statusText}
        </span>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 0 }}>
        <StatItem label="IP" value={connected && publicIp ? publicIp : "—"} mono />
        <Divider />
        <StatItem label="Uptime" value={timer ?? "—"} mono />
        <Divider />
        <StatItem label="↓ / ↑" value={connected ? `${formatBytes(rxBytes)} / ${formatBytes(txBytes)}` : "—"} mono />
      </div>

      {/* Error */}
      {error && (
        <div
          className="fade-up"
          style={{
            fontSize: 11,
            color: "#f87171",
            fontFamily: "monospace",
            lineHeight: 1.4,
            wordBreak: "break-all",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </span>
      <span style={{
        fontSize: 11,
        color: value === "—" ? "var(--text-3)" : "var(--text-2)",
        fontFamily: mono ? "monospace" : undefined,
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ width: 1, background: "var(--border)", margin: "0 12px", alignSelf: "stretch" }} />
  );
}
