import { formatBytes, isConnected, TunnelStatus } from "../types";
import { useConnectionTimer } from "../hooks/useConnectionTimer";

interface Props {
  status: TunnelStatus;
  publicIp: string | null;
  connectedAt: string | null;
  rxBytes: number;
  txBytes: number;
}

export function StatsPanel({ status, publicIp, connectedAt, rxBytes, txBytes }: Props) {
  const timer = useConnectionTimer(connectedAt);
  const connected = isConnected(status);

  const rows = [
    {
      label: "IP",
      value: publicIp ?? "—",
      mono: true,
    },
    {
      label: "UPTIME",
      value: timer ?? "—",
      mono: true,
    },
    ...(connected
      ? [
          {
            label: "↓ / ↑",
            value: `${formatBytes(rxBytes)} / ${formatBytes(txBytes)}`,
            mono: true,
          },
        ]
      : []),
  ];

  return (
    <div
      className="w-full rounded-xl px-4 py-3 flex flex-col gap-2"
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between">
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--color-text-muted)",
            }}
          >
            {row.label}
          </span>
          <span
            style={{
              fontSize: 12,
              fontFamily: row.mono ? "monospace" : undefined,
              color: row.value === "—" ? "var(--color-text-muted)" : "var(--color-text-primary)",
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
