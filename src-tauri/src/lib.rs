mod commands;
mod shutdown;
mod window;

use commands::{capture_screenshot, greet};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("🚀 Tauri application starting...");
    
    let (_is_shutting_down, shutdown_handler) = shutdown::create_shutdown_handler();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![greet, capture_screenshot])
        .setup(|app| {
            println!("✓ Plugins initialized");
            window::position_window_bottom_right(app);
            println!("✓ Application setup complete");
            Ok(())
        })
        .on_window_event(shutdown_handler)
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { .. } = event {
                println!("✓ Application shutdown complete");
            }
        });
}
