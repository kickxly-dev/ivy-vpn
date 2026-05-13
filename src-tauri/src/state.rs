use chrono::{DateTime, Utc};
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Default)]
pub enum TunnelStatus {
    #[default]
    Disconnected,
    Connecting,
    Connected,
    Disconnecting,
    Error(String),
}

#[derive(Debug, Default)]
pub struct VpnState {
    pub status: TunnelStatus,
    pub server_id: Option<String>,
    pub connected_at: Option<DateTime<Utc>>,
    pub public_ip: Option<String>,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
    pub openvpn_pid: Option<u32>,
}

pub type SharedState = Mutex<VpnState>;
