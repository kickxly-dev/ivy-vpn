use parking_lot::Mutex;
use state::VpnState;

mod commands;
mod openvpn;
mod state;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .manage(Mutex::new(VpnState::default()))
        .invoke_handler(tauri::generate_handler![
            commands::connect::connect_vpn,
            commands::connect::disconnect_vpn,
            commands::status::get_status,
        ])
        .setup(|_app| Ok(()))
        .run(tauri::generate_context!())
        .expect("error while running ivy-vpn");
}
