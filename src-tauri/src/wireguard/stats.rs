use anyhow::Result;
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

use super::tunnel::TUNNEL_NAME;

#[derive(Debug, Default)]
pub struct TransferStats {
    pub rx_bytes: u64,
    pub tx_bytes: u64,
}

pub async fn get_transfer(app: &AppHandle) -> Result<TransferStats> {
    let output = app
        .shell()
        .sidecar("wg")?
        .args(["show", TUNNEL_NAME, "transfer"])
        .output()
        .await?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    parse_transfer(&stdout)
}

fn parse_transfer(output: &str) -> Result<TransferStats> {
    let mut stats = TransferStats::default();
    for line in output.lines() {
        let parts: Vec<&str> = line.split_whitespace().collect();
        // format: <pubkey> <rx_bytes> <tx_bytes>
        if parts.len() == 3 {
            stats.rx_bytes += parts[1].parse::<u64>().unwrap_or(0);
            stats.tx_bytes += parts[2].parse::<u64>().unwrap_or(0);
        }
    }
    Ok(stats)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_transfer() {
        let output = "AAABBBCCC=    1234567    9876543\n";
        let stats = parse_transfer(output).unwrap();
        assert_eq!(stats.rx_bytes, 1234567);
        assert_eq!(stats.tx_bytes, 9876543);
    }
}
