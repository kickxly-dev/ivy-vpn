import { getCurrentWindow } from "@tauri-apps/api/window";

export function TitleBar() {
  const win = getCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-between px-4 h-8 w-full select-none shrink-0"
      style={{ borderBottom: "1px solid rgba(139,92,246,0.12)" }}
    >
      <span
        data-tauri-drag-region
        className="text-xs font-semibold tracking-[0.2em] uppercase"
        style={{ color: "var(--color-purple-vivid)" }}
      >
        IVY VPN
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => win.minimize()}
          className="w-6 h-6 flex items-center justify-center rounded text-xs transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(139,92,246,0.15)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
          title="Minimize"
        >
          ─
        </button>
        <button
          onClick={() => win.close()}
          className="w-6 h-6 flex items-center justify-center rounded text-xs transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.2)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "";
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
