import { useState } from "react";
import { TitleBar } from "./components/TitleBar";
import { ServerSelector } from "./components/ServerSelector";
import { ConnectRing } from "./components/ConnectRing";
import { StatusFooter } from "./components/StatusFooter";
import { ServerList } from "./components/ServerList";
import { useVpnState } from "./hooks/useVpnState";
import { DEFAULT_SERVERS, isConnected, Server } from "./types";

export default function App() {
  const { appStatus, loading, error, connect, disconnect } = useVpnState();
  const [showServerList, setShowServerList] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>(DEFAULT_SERVERS[0]);

  const connected = isConnected(appStatus.status);

  const handleConnect = () => connect(selectedServer.id);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "var(--bg)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <TitleBar />

      <ServerSelector
        server={selectedServer}
        connected={connected}
        onClick={() => setShowServerList(true)}
      />

      {/* Center — connect ring */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <ConnectRing
          status={loading ? (connected ? "Disconnecting" : "Connecting") : appStatus.status}
          onConnect={handleConnect}
          onDisconnect={disconnect}
        />
      </div>

      <StatusFooter
        status={loading ? (connected ? "Disconnecting" : "Connecting") : appStatus.status}
        publicIp={appStatus.publicIp}
        connectedAt={appStatus.connectedAt}
        rxBytes={appStatus.rxBytes}
        txBytes={appStatus.txBytes}
        error={error}
      />

      {showServerList && (
        <ServerList
          servers={DEFAULT_SERVERS}
          selectedId={selectedServer.id}
          onSelect={setSelectedServer}
          onClose={() => setShowServerList(false)}
        />
      )}
    </div>
  );
}
