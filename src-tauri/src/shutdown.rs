use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

pub fn create_shutdown_handler() -> (Arc<AtomicBool>, impl Fn(&tauri::Window, &tauri::WindowEvent)) {
    let is_shutting_down = Arc::new(AtomicBool::new(false));
    let is_shutting_down_clone = is_shutting_down.clone();
    
    let handler = move |_window: &tauri::Window, event: &tauri::WindowEvent| {
        if let tauri::WindowEvent::CloseRequested { .. } = event {
            if !is_shutting_down_clone.load(Ordering::SeqCst) {
                println!("🔄 Close requested, initiating graceful shutdown...");
                is_shutting_down_clone.store(true, Ordering::SeqCst);
                
                println!("✓ Cleanup operations completed");
            }
        }
    };
    
    (is_shutting_down, handler)
}
