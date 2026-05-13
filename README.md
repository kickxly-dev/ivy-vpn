# Ivy VPN

A minimal, clean Windows desktop VPN client built with Tauri 2 + React + WireGuard.

## Design
- Vibrant midnight purple + black aesthetic
- 400×600px frameless window
- Single compiled `.exe`

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) (stable toolchain)
- [Tauri prerequisites for Windows](https://tauri.app/start/prerequisites/)
- WireGuard for Windows binaries (`wg.exe`, `wireguard.exe`) placed in `src-tauri/binaries/` as:
  - `wg-x86_64-pc-windows-msvc.exe`
  - `wireguard-x86_64-pc-windows-msvc.exe`

## Development

```bash
npm install
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

Output: `src-tauri/target/release/bundle/`

## WireGuard Config

Import a standard `.conf` file from the app UI. The config is written temporarily to `%TEMP%\ivyvpn.conf` during an active session and removed on disconnect.

The app requires **Administrator privileges** (UAC prompt on first launch) to manage WireGuard tunnel services.
