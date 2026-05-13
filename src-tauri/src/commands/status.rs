use crate::state::{SharedState, TunnelStatus};
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppStatus {
    pub status: TunnelStatus,
    pub server_id: Option<String>,
    pub public_ip: Option<String>,
    pub connected_at: Option<String>,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
}

#[tauri::command]
pub async fn get_status(state: State<'_, SharedState>) -> Result<AppStatus, String> {
    let st = state.lock();
    Ok(AppStatus {
        status: st.status.clone(),
        server_id: st.server_id.clone(),
        public_ip: st.public_ip.clone(),
        connected_at: st.connected_at.map(|t| t.to_rfc3339()),
        rx_bytes: st.rx_bytes,
        tx_bytes: st.tx_bytes,
    })
}
