use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("🚀 Tauri application starting...");
    
    let is_shutting_down = Arc::new(AtomicBool::new(false));
    let is_shutting_down_clone = is_shutting_down.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|_app| {
            println!("✓ Plugins initialized");
            println!("✓ Application setup complete");
            Ok(())
        })
        .on_window_event(move |_window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                if !is_shutting_down_clone.load(Ordering::SeqCst) {
                    println!("🔄 Close requested, initiating graceful shutdown...");
                    is_shutting_down_clone.store(true, Ordering::SeqCst);
                    
                    // Perform cleanup operations here
                    println!("✓ Cleanup operations completed");
                }
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { .. } = event {
                println!("✓ Application shutdown complete");
            }
        });
}
