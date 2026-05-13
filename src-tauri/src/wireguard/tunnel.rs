use anyhow::{bail, Result};
use std::path::PathBuf;
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

pub const TUNNEL_NAME: &str = "ivyvpn";

pub fn conf_temp_path() -> PathBuf {
    let mut path = std::env::temp_dir();
    path.push(format!("{}.conf", TUNNEL_NAME));
    path
}

pub async fn bring_up(app: &AppHandle, conf_path: &str) -> Result<()> {
    let output = app
        .shell()
        .sidecar("wireguard")?
        .args(["/installtunnelservice", conf_path])
        .output()
        .await?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        bail!("Failed to start WireGuard tunnel: {}", stderr);
    }
    Ok(())
}

pub async fn bring_down(app: &AppHandle) -> Result<()> {
    let output = app
        .shell()
        .sidecar("wireguard")?
        .args(["/uninstalltunnelservice", TUNNEL_NAME])
        .output()
        .await?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        bail!("Failed to stop WireGuard tunnel: {}", stderr);
    }
    Ok(())
}

pub async fn is_tunnel_active(app: &AppHandle) -> bool {
    let Ok(cmd) = app.shell().sidecar("wg") else {
        return false;
    };
    matches!(
        cmd.args(["show", TUNNEL_NAME]).output().await,
        Ok(o) if o.status.success()
    )
}

pub async fn wait_for_handshake(app: &AppHandle) -> Result<()> {
    use tokio::time::{sleep, Duration};

    for _ in 0..20 {
        let output = app
            .shell()
            .sidecar("wg")?
            .args(["show", TUNNEL_NAME, "latest-handshakes"])
            .output()
            .await?;

        let stdout = String::from_utf8_lossy(&output.stdout);
        // A non-zero handshake timestamp means the peer connected
        let has_handshake = stdout
            .lines()
            .filter_map(|l| l.split_whitespace().nth(1))
            .any(|ts| ts != "0");

        if has_handshake {
            return Ok(());
        }
        sleep(Duration::from_millis(500)).await;
    }
    bail!("Handshake timeout — could not reach peer")
}
