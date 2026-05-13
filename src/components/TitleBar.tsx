import { getCurrentWindow } from "@tauri-apps/api/window";

export function TitleBar() {
  const win = getCurrentWindow();
  return (
    <div
      data-tauri-drag-region
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px 0 20px",
        flexShrink: 0,
      }}
    >
      <span
        data-tauri-drag-region
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.22em",
          color: "var(--accent)",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        ivy
      </span>
      <button
        onClick={() => win.close()}
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-3)",
          fontSize: 14,
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-3)";
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
        title="Close"
      >
        ✕
      </button>
    </div>
  );
}
