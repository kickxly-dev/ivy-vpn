import { TunnelStatus, statusLabel, isConnected, isConnecting } from "../types";

interface Props {
  status: TunnelStatus;
}

export function StatusBadge({ status }: Props) {
  const connected = isConnected(status);
  const connecting = isConnecting(status);

  const dotColor = connected
    ? "var(--color-connected)"
    : connecting
    ? "var(--color-connecting)"
    : "var(--color-disconnected)";

  const textColor = connected
    ? "var(--color-connected)"
    : connecting
    ? "var(--color-connecting)"
    : "var(--color-disconnected)";

  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full"
      style={{
        background: "rgba(139,92,246,0.08)",
        border: "1px solid rgba(139,92,246,0.18)",
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: 6,
          height: 6,
          background: dotColor,
          boxShadow: connected ? `0 0 6px ${dotColor}` : undefined,
        }}
      />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: textColor,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        {statusLabel(status)}
      </span>
    </div>
  );
}
