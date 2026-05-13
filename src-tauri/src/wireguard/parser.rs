use crate::state::WireGuardConfig;
use anyhow::{bail, Result};
use regex::Regex;

pub fn parse_conf(raw: &str, name_hint: &str) -> Result<WireGuardConfig> {
    let name = extract_name(raw, name_hint);
    let private_key = extract_value(raw, "PrivateKey")
        .ok_or_else(|| anyhow::anyhow!("Missing PrivateKey in [Interface]"))?;
    let address = extract_value(raw, "Address")
        .ok_or_else(|| anyhow::anyhow!("Missing Address in [Interface]"))?;
    let dns = extract_value(raw, "DNS");
    let peer_public_key = extract_value(raw, "PublicKey")
        .ok_or_else(|| anyhow::anyhow!("Missing PublicKey in [Peer]"))?;
    let endpoint = extract_value(raw, "Endpoint")
        .ok_or_else(|| anyhow::anyhow!("Missing Endpoint in [Peer]"))?;
    let allowed_ips = extract_value(raw, "AllowedIPs")
        .ok_or_else(|| anyhow::anyhow!("Missing AllowedIPs in [Peer]"))?;

    if !raw.contains("[Interface]") || !raw.contains("[Peer]") {
        bail!("Invalid WireGuard config: missing [Interface] or [Peer] section");
    }

    Ok(WireGuardConfig {
        name,
        private_key,
        address,
        dns,
        peer_public_key,
        endpoint,
        allowed_ips,
        raw: raw.to_string(),
    })
}

fn extract_value(raw: &str, key: &str) -> Option<String> {
    let pattern = format!(r"(?m)^\s*{}\s*=\s*(.+)$", regex::escape(key));
    let re = Regex::new(&pattern).ok()?;
    re.captures(raw)
        .and_then(|c| c.get(1))
        .map(|m| m.as_str().trim().to_string())
}

fn extract_name(raw: &str, fallback: &str) -> String {
    // Check for "# Name = ..." convention
    let re = Regex::new(r"(?m)^#\s*[Nn]ame\s*=\s*(.+)$").unwrap();
    if let Some(caps) = re.captures(raw) {
        if let Some(m) = caps.get(1) {
            return m.as_str().trim().to_string();
        }
    }
    fallback.to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE_CONF: &str = r#"
# Name = My Server
[Interface]
PrivateKey = AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=
Endpoint = 1.2.3.4:51820
AllowedIPs = 0.0.0.0/0
"#;

    #[test]
    fn test_parse_conf() {
        let cfg = parse_conf(SAMPLE_CONF, "fallback").unwrap();
        assert_eq!(cfg.name, "My Server");
        assert_eq!(cfg.address, "10.0.0.2/24");
        assert_eq!(cfg.endpoint, "1.2.3.4:51820");
        assert_eq!(cfg.dns, Some("1.1.1.1".to_string()));
    }

    #[test]
    fn test_fallback_name() {
        let conf = "[Interface]\nPrivateKey = AAA=\nAddress = 10.0.0.2/24\n[Peer]\nPublicKey = BBB=\nEndpoint = 1.2.3.4:51820\nAllowedIPs = 0.0.0.0/0\n";
        let cfg = parse_conf(conf, "my-server").unwrap();
        assert_eq!(cfg.name, "my-server");
    }
}
