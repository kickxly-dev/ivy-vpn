import { TunnelStatus, isConnected, isConnecting } from "../types";

interface Props {
  status: TunnelStatus;
  loading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ConnectButton({ status, loading, onConnect, onDisconnect }: Props) {
  const connected = isConnected(status);
  const connecting = isConnecting(status);
  const busy = loading || connecting;

  const handleClick = () => {
    if (busy) return;
    if (connected) onDisconnect();
    else onConnect();
  };

  const label = connecting ? "CONNECTING" : connected ? "DISCONNECT" : "CONNECT";

  const glowConnected =
    "0 0 0 2px #A855F7, 0 0 30px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.25)";
  const glowIdle =
    "0 0 0 2px #6D28D9, 0 0 20px rgba(109,40,217,0.35)";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse ring — only while connecting */}
      {connecting && (
        <span
          className="absolute rounded-full animate-ring-pulse"
          style={{
            width: 180,
            height: 180,
            border: "2px solid rgba(168,85,247,0.5)",
            pointerEvents: "none",
          }}
        />
      )}

      <button
        onClick={handleClick}
        disabled={busy && !connected}
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: connected
            ? "radial-gradient(circle at 40% 35%, #9333ea, #6d28d9)"
            : "radial-gradient(circle at 40% 35%, #6d28d9, #3b1278)",
          boxShadow: connected ? glowConnected : glowIdle,
          border: "none",
          cursor: busy && !connected ? "not-allowed" : "pointer",
          transition: "box-shadow 0.4s ease, background 0.4s ease, transform 0.1s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 6,
          outline: "none",
        }}
        onMouseEnter={(e) => {
          if (!busy) {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
        }}
      >
        {/* Power icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={connected ? "#e9d5ff" : "#c4b5fd"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: connected ? "#e9d5ff" : "#c4b5fd",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}
        >
          {label}
        </span>
      </button>
    </div>
  );
}
