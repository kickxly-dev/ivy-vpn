import { Server } from "../types";

interface Props {
  servers: Server[];
  selectedId: string;
  onSelect: (server: Server) => void;
  onClose: () => void;
}

export function ServerList({ servers, selectedId, onSelect, onClose }: Props) {
  return (
    <div
      className="fade-up"
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* Header */}
      <div style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "var(--text-2)", textTransform: "uppercase" }}>
          Select server
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-3)",
            fontSize: 14,
            padding: 4,
            display: "flex",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "var(--text)"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "var(--text-3)"}
        >
          ✕
        </button>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {servers.map(s => (
          <button
            key={s.id}
            onClick={() => { onSelect(s); onClose(); }}
            style={{
              width: "100%",
              background: s.id === selectedId ? "var(--surface)" : "transparent",
              border: "none",
              borderBottom: "1px solid var(--border)",
              cursor: "pointer",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              textAlign: "left",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => {
              if (s.id !== selectedId)
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={e => {
              if (s.id !== selectedId)
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{s.flag}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.01em" }}>
                {s.city}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 1 }}>
                {s.country}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <LoadDot load={s.load} />
              {s.id === selectedId && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadDot({ load }: { load: number }) {
  const color = load > 70 ? "#f87171" : load > 40 ? "#fbbf24" : "#4ade80";
  return (
    <span style={{
      width: 6, height: 6, borderRadius: "50%",
      background: color, flexShrink: 0,
      opacity: 0.7,
    }} />
  );
}
