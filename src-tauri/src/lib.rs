use parking_lot::Mutex;
use state::VpnState;

mod commands;
mod state;
mod wireguard;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .manage(Mutex::new(VpnState::default()))
        .invoke_handler(tauri::generate_handler![
            commands::config::import_config,
            commands::config::get_active_config,
            commands::connect::connect_vpn,
            commands::connect::disconnect_vpn,
            commands::status::get_status,
            commands::status::fetch_public_ip,
        ])
        .setup(|_app| Ok(()))
        .run(tauri::generate_context!())
        .expect("error while running ivy-vpn");
}
