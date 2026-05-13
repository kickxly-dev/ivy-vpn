use anyhow::{bail, Result};
use std::path::PathBuf;
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

pub fn config_temp_path() -> PathBuf {
    let mut p = std::env::temp_dir();
    p.push("ivyvpn_active.ovpn");
    p
}

pub async fn start(app: &AppHandle, config_content: &str) -> Result<()> {
    let path = config_temp_path();
    std::fs::write(&path, config_content)?;

    let output = app
        .shell()
        .sidecar("openvpn")?
        .args(["--config", &path.to_string_lossy(), "--daemon"])
        .output()
        .await?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        bail!("OpenVPN failed to start: {}", err);
    }
    Ok(())
}

pub async fn stop(app: &AppHandle) -> Result<()> {
    // Send SIGTERM to openvpn process on Unix; on Windows use management interface
    let output = app
        .shell()
        .sidecar("openvpn")?
        .args(["--signal", "SIGTERM"])
        .output()
        .await;

    // Best-effort: also try pkill
    let _ = app.shell().command("pkill").args(["-f", "ivyvpn_active.ovpn"]).output().await;

    let _ = std::fs::remove_file(config_temp_path());

    // If sidecar call itself failed structurally, that's ok — process may be gone
    let _ = output;
    Ok(())
}

pub async fn wait_for_connection(app: &AppHandle) -> Result<()> {
    use tokio::time::{sleep, Duration};

    // Poll for the tun0/tun1 interface or check openvpn log
    // For now, use a fixed wait with log-file check
    for _ in 0..30 {
        let out = app
            .shell()
            .command("grep")
            .args(["-q", "Initialization Sequence Completed", "/tmp/ivyvpn.log"])
            .output()
            .await;

        if matches!(out, Ok(o) if o.status.success()) {
            return Ok(());
        }
        sleep(Duration::from_millis(500)).await;
    }
    bail!("Connection timed out — could not reach server")
}
