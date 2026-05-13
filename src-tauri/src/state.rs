use chrono::{DateTime, Utc};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum TunnelStatus {
    Disconnected,
    Connecting,
    Connected,
    Error(String),
}

impl Default for TunnelStatus {
    fn default() -> Self {
        TunnelStatus::Disconnected
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WireGuardConfig {
    pub name: String,
    pub private_key: String,
    pub address: String,
    pub dns: Option<String>,
    pub peer_public_key: String,
    pub endpoint: String,
    pub allowed_ips: String,
    pub raw: String,
}

#[derive(Debug, Default)]
pub struct VpnState {
    pub status: TunnelStatus,
    pub config: Option<WireGuardConfig>,
    pub connected_at: Option<DateTime<Utc>>,
    pub public_ip: Option<String>,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
}

pub type SharedState = Mutex<VpnState>;
