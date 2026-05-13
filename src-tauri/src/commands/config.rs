use crate::state::{SharedState, WireGuardConfig};
use crate::wireguard::parser;
use serde::Serialize;
use std::path::Path;
use tauri::State;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PublicConfig {
    pub name: String,
    pub address: String,
    pub dns: Option<String>,
    pub endpoint: String,
    pub allowed_ips: String,
}

impl From<&WireGuardConfig> for PublicConfig {
    fn from(c: &WireGuardConfig) -> Self {
        PublicConfig {
            name: c.name.clone(),
            address: c.address.clone(),
            dns: c.dns.clone(),
            endpoint: c.endpoint.clone(),
            allowed_ips: c.allowed_ips.clone(),
        }
    }
}

#[tauri::command]
pub async fn import_config(
    path: String,
    state: State<'_, SharedState>,
) -> Result<PublicConfig, String> {
    let raw = std::fs::read_to_string(&path).map_err(|e| format!("Cannot read file: {e}"))?;

    let name_hint = Path::new(&path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("Unknown")
        .to_string();

    let config = parser::parse_conf(&raw, &name_hint).map_err(|e| e.to_string())?;
    let public = PublicConfig::from(&config);

    let mut st = state.lock();
    st.config = Some(config);

    Ok(public)
}

#[tauri::command]
pub async fn get_active_config(state: State<'_, SharedState>) -> Result<Option<PublicConfig>, String> {
    let st = state.lock();
    Ok(st.config.as_ref().map(PublicConfig::from))
}
