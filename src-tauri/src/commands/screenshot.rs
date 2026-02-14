use std::fs;
use tauri::Manager;

#[tauri::command]
pub async fn capture_screenshot(
    app: tauri::AppHandle,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) -> Result<String, String> {
    println!("📸 Capturing screenshot: x={}, y={}, width={}, height={}", x, y, width, height);
    
    let filepath = capture_and_save(app, x, y, width, height).await?;
    
    println!("   ✓ Screenshot saved to: {:?}", filepath);
    Ok(filepath)
}

async fn capture_and_save(
    app: tauri::AppHandle,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) -> Result<String, String> {
    let screenshots_dir = setup_screenshots_directory(&app)?;
    let timestamp = get_timestamp();
    let filepath = screenshots_dir.join(format!("screenshot_{}.png", timestamp));
    
    let img = capture_screen()?;
    save_and_crop_screenshot(img, &filepath, x, y, width, height)?;
    
    Ok(filepath.to_string_lossy().to_string())
}

fn setup_screenshots_directory(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let app_dir = app.path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app directory: {}", e))?;
    
    let screenshots_dir = app_dir.join("screenshots");
    fs::create_dir_all(&screenshots_dir)
        .map_err(|e| format!("Failed to create screenshots directory: {}", e))?;
    
    Ok(screenshots_dir)
}

fn get_timestamp() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs()
}

fn capture_screen() -> Result<image::DynamicImage, String> {
    use screenshots::Screen;
    
    println!("   Capturing screen area...");
    
    let screens = Screen::all().map_err(|e| format!("Failed to get screens: {}", e))?;
    
    if screens.is_empty() {
        return Err("No screens found".to_string());
    }
    
    let screen = &screens[0];
    println!("   Screen size: {}x{}", screen.display_info.width, screen.display_info.height);
    
    let screenshot_img = screen.capture().map_err(|e| format!("Failed to capture screen: {}", e))?;
    println!("   Screen captured, dimensions: {}x{}", screenshot_img.width(), screenshot_img.height());
    
    // Convert to DynamicImage
    let buffer = screenshot_img.as_raw();
    let img = image::RgbaImage::from_raw(screenshot_img.width(), screenshot_img.height(), buffer.to_vec())
        .ok_or_else(|| "Failed to create image from buffer".to_string())?;
    
    Ok(image::DynamicImage::ImageRgba8(img))
}

fn save_and_crop_screenshot(
    img: image::DynamicImage,
    filepath: &std::path::Path,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) -> Result<(), String> {
    
    let (x, y, crop_width, crop_height) = calculate_crop_bounds(&img, x, y, width, height);
    println!("   Cropping to: x={}, y={}, width={}, height={}", x, y, crop_width, crop_height);
    
    let cropped = img.crop_imm(x, y, crop_width, crop_height);
    cropped.save(filepath)
        .map_err(|e| format!("Failed to save screenshot: {}", e))?;
    
    Ok(())
}

fn calculate_crop_bounds(
    img: &image::DynamicImage,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
) -> (u32, u32, u32, u32) {
    let x = x.max(0) as u32;
    let y = y.max(0) as u32;
    let img_width = img.width();
    let img_height = img.height();
    let crop_width = width.min(img_width.saturating_sub(x));
    let crop_height = height.min(img_height.saturating_sub(y));
    
    (x, y, crop_width, crop_height)
}

