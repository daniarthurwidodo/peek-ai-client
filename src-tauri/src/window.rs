use tauri::Manager;

pub fn position_window_bottom_right(app: &tauri::App) {
    if let Some(window) = app.get_webview_window("main") {
        if let Ok(monitor) = window.current_monitor() {
            if let Some(monitor) = monitor {
                let monitor_size = monitor.size();
                let window_size = window.outer_size().unwrap_or(tauri::PhysicalSize { width: 400, height: 1000 });
                
                let padding = 50;
                let x = monitor_size.width as i32 - window_size.width as i32 - padding;
                let y = monitor_size.height as i32 - window_size.height as i32 - padding;
                
                let _ = window.set_position(tauri::PhysicalPosition { x, y });
                println!("✓ Window positioned at bottom right: ({}, {})", x, y);
            }
        }
    }
}
