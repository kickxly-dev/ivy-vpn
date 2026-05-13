use crate::state::{SharedState, TunnelStatus};
use crate::wireguard::stats;
use serde::Serialize;
use tauri::{AppHandle, State};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StatusResponse {
    pub status: TunnelStatus,
    pub server_name: Option<String>,
    pub public_ip: Option<String>,
    pub connected_at: Option<String>,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
}

#[tauri::command]
pub async fn get_status(
    app: AppHandle,
    state: State<'_, SharedState>,
) -> Result<StatusResponse, String> {
    let is_connected = {
        let st = state.lock();
        st.status == TunnelStatus::Connected
    };

    if is_connected {
        if let Ok(transfer) = stats::get_transfer(&app).await {
            let mut st = state.lock();
            st.rx_bytes = transfer.rx_bytes;
            st.tx_bytes = transfer.tx_bytes;
        }
    }

    let st = state.lock();
    Ok(StatusResponse {
        status: st.status.clone(),
        server_name: st.config.as_ref().map(|c| c.name.clone()),
        public_ip: st.public_ip.clone(),
        connected_at: st.connected_at.map(|t| t.to_rfc3339()),
        rx_bytes: st.rx_bytes,
        tx_bytes: st.tx_bytes,
    })
}

#[tauri::command]
pub async fn fetch_public_ip() -> Result<String, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()
        .map_err(|e| e.to_string())?;

    let ip = client
        .get("https://api.ipify.org?format=text")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;

    Ok(ip.trim().to_string())
}
