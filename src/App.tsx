import { TitleBar } from "./components/TitleBar";
import { ConnectButton } from "./components/ConnectButton";
import { StatusBadge } from "./components/StatusBadge";
import { ServerCard } from "./components/ServerCard";
import { StatsPanel } from "./components/StatsPanel";
import { ConfigImport } from "./components/ConfigImport";
import { useVpnState } from "./hooks/useVpnState";
import { isConnected } from "./types";

export default function App() {
  const { status, loading, error, connect, disconnect, importConfig } = useVpnState();
  const connected = isConnected(status.status);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "var(--color-bg)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(139,92,246,0.2)",
      }}
    >
      <TitleBar />

      <div className="flex flex-col flex-1 px-5 pb-5 pt-4 gap-4 overflow-hidden">
        {/* Server card */}
        <ServerCard
          serverName={status.serverName}
          endpoint={null}
          onImport={importConfig}
        />

        {/* Center area: ambient glow + connect button */}
        <div className="ambient-glow flex-1 flex flex-col items-center justify-center gap-4">
          <ConnectButton
            status={status.status}
            loading={loading}
            onConnect={connect}
            onDisconnect={disconnect}
          />
          <StatusBadge status={status.status} />
        </div>

        {/* Stats */}
        <StatsPanel
          status={status.status}
          publicIp={status.publicIp}
          connectedAt={status.connectedAt}
          rxBytes={status.rxBytes}
          txBytes={status.txBytes}
        />

        {/* Error message */}
        {error && (
          <div
            className="w-full rounded-lg px-3 py-2 text-xs animate-fade-in"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
              fontFamily: "monospace",
              wordBreak: "break-all",
            }}
          >
            {error}
          </div>
        )}

        {/* Footer: config import + version */}
        <div className="flex items-center justify-between">
          <ConfigImport onImport={importConfig} hasConfig={!!status.serverName} />
          <span
            style={{ fontSize: 10, color: "rgba(139,92,246,0.35)", letterSpacing: "0.05em" }}
          >
            v0.1.0
          </span>
        </div>
      </div>
    </div>
  );
}
