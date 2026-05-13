use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Server {
    pub id: String,
    pub city: String,
    pub country: String,
    pub flag: String,
    pub load: u8,
    pub host: String,
    pub port: u16,
}

pub fn all_servers() -> Vec<Server> {
    vec![
        Server { id: "us-ny".into(), city: "New York".into(), country: "United States".into(), flag: "🇺🇸".into(), load: 44, host: "us-ny.ivyvpn.net".into(), port: 1194 },
        Server { id: "uk-lon".into(), city: "London".into(), country: "United Kingdom".into(), flag: "🇬🇧".into(), load: 31, host: "uk-lon.ivyvpn.net".into(), port: 1194 },
        Server { id: "de-fra".into(), city: "Frankfurt".into(), country: "Germany".into(), flag: "🇩🇪".into(), load: 27, host: "de-fra.ivyvpn.net".into(), port: 1194 },
        Server { id: "nl-ams".into(), city: "Amsterdam".into(), country: "Netherlands".into(), flag: "🇳🇱".into(), load: 58, host: "nl-ams.ivyvpn.net".into(), port: 1194 },
        Server { id: "sg-sin".into(), city: "Singapore".into(), country: "Singapore".into(), flag: "🇸🇬".into(), load: 62, host: "sg-sin.ivyvpn.net".into(), port: 1194 },
        Server { id: "jp-tky".into(), city: "Tokyo".into(), country: "Japan".into(), flag: "🇯🇵".into(), load: 39, host: "jp-tky.ivyvpn.net".into(), port: 1194 },
        Server { id: "ca-tor".into(), city: "Toronto".into(), country: "Canada".into(), flag: "🇨🇦".into(), load: 35, host: "ca-tor.ivyvpn.net".into(), port: 1194 },
        Server { id: "au-syd".into(), city: "Sydney".into(), country: "Australia".into(), flag: "🇦🇺".into(), load: 22, host: "au-syd.ivyvpn.net".into(), port: 1194 },
        Server { id: "fr-par".into(), city: "Paris".into(), country: "France".into(), flag: "🇫🇷".into(), load: 47, host: "fr-par.ivyvpn.net".into(), port: 1194 },
        Server { id: "ch-zur".into(), city: "Zurich".into(), country: "Switzerland".into(), flag: "🇨🇭".into(), load: 19, host: "ch-zur.ivyvpn.net".into(), port: 1194 },
    ]
}

pub fn find_server(id: &str) -> Option<Server> {
    all_servers().into_iter().find(|s| s.id == id)
}

/// Build an OpenVPN config string for a server.
/// In production, embed real CA cert and TLS key here.
pub fn build_config(server: &Server) -> String {
    format!(
        r#"client
dev tun
proto udp
remote {host} {port}
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
auth SHA256
verb 3
"#,
        host = server.host,
        port = server.port,
    )
}
