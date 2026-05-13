import { Server } from "../types";

interface Props {
  server: Server;
  connected: boolean;
  onClick: () => void;
}

export function ServerSelector({ server, connected, onClick }: Props) {
  return (
    <button
      onClick={connected ? undefined : onClick}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        cursor: connected ? "default" : "pointer",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        textAlign: "left",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!connected)
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{server.flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: "var(--text)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {server.city}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 2, letterSpacing: "0.02em" }}>
          {server.country}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
        <LoadBar load={server.load} />
        {!connected && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </div>
    </button>
  );
}

function LoadBar({ load }: { load: number }) {
  const color = load > 70 ? "#f87171" : load > 40 ? "#fbbf24" : "#4ade80";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 28, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${load}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 10, color: "var(--text-3)", fontVariantNumeric: "tabular-nums", minWidth: 24 }}>
        {load}%
      </span>
    </div>
  );
}
