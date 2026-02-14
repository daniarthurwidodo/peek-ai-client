use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tauri::Manager;

#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::{SetSystemCursor, LoadCursorW, OCR_NORMAL, OCR_CROSS, SYSTEM_CURSOR_ID};

#[cfg(target_os = "macos")]
use cocoa::appkit::NSCursor;
#[cfg(target_os = "macos")]
use cocoa::base::{id, nil};
#[cfg(target_os = "macos")]
use objc::{msg_send, sel, sel_impl};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn set_cursor_icon(window: tauri::Window, cursor_type: String) -> Result<(), String> {
    use tauri::CursorIcon;
    
    let cursor = match cursor_type.as_str() {
        "crosshair" => CursorIcon::Crosshair,
        "default" => CursorIcon::Default,
        _ => CursorIcon::Default,
    };
    
    window.set_cursor_icon(cursor)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn set_system_cursor(cursor_type: String) -> Result<(), String> {
    println!("🖱️  set_system_cursor called with type: {}", cursor_type);
    
    #[cfg(target_os = "windows")]
    {
        let result = set_system_cursor_windows(&cursor_type);
        match &result {
            Ok(_) => println!("✓ Windows system cursor set successfully to: {}", cursor_type),
            Err(e) => println!("✗ Windows system cursor failed: {}", e),
        }
        result
    }
    
    #[cfg(target_os = "macos")]
    {
        let result = set_system_cursor_macos(&cursor_type);
        match &result {
            Ok(_) => println!("✓ macOS system cursor set successfully to: {}", cursor_type),
            Err(e) => println!("✗ macOS system cursor failed: {}", e),
        }
        result
    }
    
    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    {
        println!("✗ System cursor control not supported on this platform");
        Err("System cursor control not supported on this platform".to_string())
    }
}

#[cfg(target_os = "windows")]
fn set_system_cursor_windows(cursor_type: &str) -> Result<(), String> {
    println!("🪟 Windows: Loading cursor type: {}", cursor_type);
    
    unsafe {
        use windows::Win32::Foundation::HINSTANCE;
        use windows::core::PCWSTR;
        
        let cursor_id = match cursor_type {
            "crosshair" => {
                println!("   Using OCR_CROSS cursor");
                OCR_CROSS
            },
            "default" => {
                println!("   Using OCR_NORMAL cursor");
                OCR_NORMAL
            },
            _ => {
                println!("   Unknown type, defaulting to OCR_NORMAL");
                OCR_NORMAL
            }
        };
        
        println!("   Loading cursor with ID: {:?}", cursor_id);
        let cursor = LoadCursorW(
            HINSTANCE::default(),
            PCWSTR(cursor_id.0 as *const u16)
        ).map_err(|e| {
            let err_msg = format!("Failed to load cursor: {}", e);
            println!("   ✗ {}", err_msg);
            err_msg
        })?;
        
        println!("   ✓ Cursor loaded, setting system cursor...");
        SetSystemCursor(cursor, SYSTEM_CURSOR_ID(OCR_NORMAL.0))
            .map_err(|e| {
                let err_msg = format!("Failed to set system cursor: {}", e);
                println!("   ✗ {}", err_msg);
                err_msg
            })?;
        
        println!("   ✓ System cursor set successfully");
        Ok(())
    }
}

#[cfg(target_os = "macos")]
fn set_system_cursor_macos(cursor_type: &str) -> Result<(), String> {
    println!("🍎 macOS: Setting cursor type: {}", cursor_type);
    
    unsafe {
        let cursor: id = match cursor_type {
            "crosshair" => {
                println!("   Using crosshair cursor");
                msg_send![class!(NSCursor), crosshairCursor]
            },
            "default" => {
                println!("   Using arrow cursor");
                msg_send![class!(NSCursor), arrowCursor]
            },
            _ => {
                println!("   Unknown type, defaulting to arrow cursor");
                msg_send![class!(NSCursor), arrowCursor]
            }
        };
        
        println!("   Setting cursor...");
        let _: () = msg_send![cursor, set];
        println!("   ✓ Cursor set successfully");
        
        Ok(())
    }
}

#[tauri::command]
async fn capture_screenshot(
    app: tauri::AppHandle,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) -> Result<String, String> {
    println!("📸 Capturing screenshot: x={}, y={}, width={}, height={}", x, y, width, height);
    
    use std::fs;
    
    // Get the app's data directory
    let app_dir = app.path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app directory: {}", e))?;
    
    // Create screenshots directory if it doesn't exist
    let screenshots_dir = app_dir.join("screenshots");
    fs::create_dir_all(&screenshots_dir)
        .map_err(|e| format!("Failed to create screenshots directory: {}", e))?;
    
    // Generate filename with timestamp
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    let filename = format!("screenshot_{}.png", timestamp);
    let filepath = screenshots_dir.join(&filename);
    
    println!("   Capturing screen area...");
    
    // Capture screenshot using screenshots crate
    use screenshots::Screen;
    
    let screens = Screen::all().map_err(|e| format!("Failed to get screens: {}", e))?;
    
    if screens.is_empty() {
        return Err("No screens found".to_string());
    }
    
    // Use the primary screen
    let screen = &screens[0];
    println!("   Screen size: {}x{}", screen.display_info.width, screen.display_info.height);
    
    // Capture the entire screen first
    let screenshot_img = screen.capture().map_err(|e| format!("Failed to capture screen: {}", e))?;
    
    println!("   Screen captured, dimensions: {}x{}", screenshot_img.width(), screenshot_img.height());
    
    // Save the full screenshot first
    let temp_path = screenshots_dir.join(format!("temp_{}.png", timestamp));
    screenshot_img.save(&temp_path)
        .map_err(|e| format!("Failed to save temp screenshot: {}", e))?;
    
    // Now load it with the image crate and crop
    let img = image::open(&temp_path)
        .map_err(|e| format!("Failed to open temp screenshot: {}", e))?;
    
    // Ensure coordinates are within bounds
    let x = x.max(0) as u32;
    let y = y.max(0) as u32;
    let img_width = img.width();
    let img_height = img.height();
    let crop_width = width.min(img_width.saturating_sub(x));
    let crop_height = height.min(img_height.saturating_sub(y));
    
    println!("   Cropping to: x={}, y={}, width={}, height={}", x, y, crop_width, crop_height);
    
    let cropped = img.crop_imm(x, y, crop_width, crop_height);
    
    // Save the cropped image
    cropped.save(&filepath)
        .map_err(|e| format!("Failed to save screenshot: {}", e))?;
    
    // Clean up temp file
    let _ = fs::remove_file(&temp_path);
    
    println!("   ✓ Screenshot saved to: {:?}", filepath);
    
    Ok(filepath.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("🚀 Tauri application starting...");
    
    let is_shutting_down = Arc::new(AtomicBool::new(false));
    let is_shutting_down_clone = is_shutting_down.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![greet, set_cursor_icon, set_system_cursor, capture_screenshot])
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
