import { ConnectionStatus, isConnected, isConnecting } from "../types";

interface Props {
  status: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}

const R = 80;
const CIRC = 2 * Math.PI * R; // ~502.65

export function ConnectRing({ status, onConnect, onDisconnect }: Props) {
  const connected = isConnected(status);
  const busy = isConnecting(status);

  const ringColor = connected ? "var(--green)" : "var(--accent)";
  const ringOffset = connected ? 0 : CIRC;

  const iconColor = connected
    ? "var(--green)"
    : busy
    ? "var(--accent)"
    : "var(--text-2)";

  const label = status === "Disconnecting"
    ? "DISCONNECTING"
    : status === "Connecting"
    ? "CONNECTING"
    : connected
    ? "CONNECTED"
    : "CONNECT";

  const handleClick = () => {
    if (busy) return;
    if (connected) onDisconnect();
    else onConnect();
  };

  return (
    <div style={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>
      {/* SVG rings */}
      <svg
        width="200"
        height="200"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Track */}
        <circle
          cx="100" cy="100" r={R}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />
        {/* Progress ring */}
        {!busy && (
          <circle
            cx="100" cy="100" r={R}
            fill="none"
            stroke={ringColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dashoffset 0.7s ease, stroke 0.3s ease" }}
          />
        )}
        {/* Spinning arc when busy */}
        {busy && (
          <circle
            cx="100" cy="100" r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * 0.72}
            className="ring-spin"
          />
        )}
      </svg>

      {/* Hit area / button */}
      <button
        onClick={handleClick}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "transparent",
          border: "none",
          cursor: busy ? "default" : "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          outline: "none",
        }}
      >
        {/* Power icon */}
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.3s" }}
        >
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: iconColor,
            transition: "color 0.3s",
          }}
        >
          {label}
        </span>
      </button>
    </div>
  );
}
