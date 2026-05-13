use crate::openvpn::{servers, tunnel};
use crate::state::{SharedState, TunnelStatus};
use chrono::Utc;
use tauri::{AppHandle, State};

#[tauri::command]
pub async fn connect_vpn(
    server_id: String,
    app: AppHandle,
    state: State<'_, SharedState>,
) -> Result<(), String> {
    let server = servers::find_server(&server_id)
        .ok_or_else(|| format!("Unknown server: {server_id}"))?;

    {
        let mut st = state.lock();
        st.status = TunnelStatus::Connecting;
        st.server_id = Some(server_id.clone());
    }

    let config = servers::build_config(&server);

    tunnel::start(&app, &config).await.map_err(|e| {
        let mut st = state.lock();
        st.status = TunnelStatus::Error(e.to_string());
        e.to_string()
    })?;

    // Best-effort: wait for tunnel to come up
    let _ = tunnel::wait_for_connection(&app).await;

    let public_ip = fetch_ip().await.ok();

    let mut st = state.lock();
    st.status = TunnelStatus::Connected;
    st.connected_at = Some(Utc::now());
    st.public_ip = public_ip;
    st.rx_bytes = 0;
    st.tx_bytes = 0;

    Ok(())
}

#[tauri::command]
pub async fn disconnect_vpn(
    app: AppHandle,
    state: State<'_, SharedState>,
) -> Result<(), String> {
    {
        let mut st = state.lock();
        st.status = TunnelStatus::Disconnecting;
    }

    tunnel::stop(&app).await.map_err(|e| e.to_string())?;

    let mut st = state.lock();
    st.status = TunnelStatus::Disconnected;
    st.connected_at = None;
    st.public_ip = None;
    st.rx_bytes = 0;
    st.tx_bytes = 0;

    Ok(())
}

async fn fetch_ip() -> anyhow::Result<String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()?;
    let ip = client
        .get("https://api.ipify.org?format=text")
        .send().await?.text().await?;
    Ok(ip.trim().to_string())
}
