use crate::state::{SharedState, TunnelStatus};
use crate::wireguard::tunnel;
use chrono::Utc;
use tauri::{AppHandle, State};

#[tauri::command]
pub async fn connect_vpn(
    app: AppHandle,
    state: State<'_, SharedState>,
) -> Result<(), String> {
    let conf_raw = {
        let st = state.lock();
        match &st.config {
            Some(c) => c.raw.clone(),
            None => return Err("No WireGuard config loaded. Import a .conf file first.".into()),
        }
    };

    {
        let mut st = state.lock();
        st.status = TunnelStatus::Connecting;
    }

    let conf_path = tunnel::conf_temp_path();
    std::fs::write(&conf_path, &conf_raw)
        .map_err(|e| format!("Failed to write temp config: {e}"))?;

    let conf_path_str = conf_path.to_string_lossy().to_string();

    tunnel::bring_up(&app, &conf_path_str)
        .await
        .map_err(|e| {
            let mut st = state.lock();
            st.status = TunnelStatus::Error(e.to_string());
            e.to_string()
        })?;

    tunnel::wait_for_handshake(&app).await.map_err(|e| {
        let mut st = state.lock();
        st.status = TunnelStatus::Error(e.to_string());
        e.to_string()
    })?;

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
    tunnel::bring_down(&app).await.map_err(|e| e.to_string())?;

    let mut st = state.lock();
    st.status = TunnelStatus::Disconnected;
    st.connected_at = None;
    st.public_ip = None;
    st.rx_bytes = 0;
    st.tx_bytes = 0;

    // Remove temp config file
    let _ = std::fs::remove_file(tunnel::conf_temp_path());

    Ok(())
}

async fn fetch_ip() -> anyhow::Result<String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(5))
        .build()?;
    let ip = client
        .get("https://api.ipify.org?format=text")
        .send()
        .await?
        .text()
        .await?;
    Ok(ip.trim().to_string())
}
