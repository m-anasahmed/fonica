use tauri_plugin_shell::ShellExt;

#[tauri::command]
async fn set_volume(app: tauri::AppHandle, level: u32) -> Result<String, String> {
    let level = level.min(100);
    let ps_script = format!(
        "Add-Type -TypeDefinition 'using System; using System.Runtime.InteropServices; \
         public class Vol {{ [DllImport(\"winmm.dll\")] public static extern int waveOutSetVolume(IntPtr h, uint vol); }}'; \
         $v = [uint32]([math]::Round({} / 100.0 * 65535)); \
         [Vol]::waveOutSetVolume([IntPtr]::Zero, ($v -bor ($v -shl 16)));",
        level
    );

    let output = app
        .shell()
        .command("powershell")
        .args(["-NoProfile", "-NonInteractive", "-Command", &ps_script])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(format!("Volume set to {}%", level))
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn get_volume(app: tauri::AppHandle) -> Result<u32, String> {
    let script = "(Get-AudioDevice -Playback).Volume";
    let output = app
        .shell()
        .command("powershell")
        .args(["-NoProfile", "-NonInteractive", "-Command", script])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    String::from_utf8_lossy(&output.stdout)
        .trim()
        .parse::<f64>()
        .map(|v| v as u32)
        .map_err(|_| "Could not parse volume".to_string())
}

#[tauri::command]
async fn set_brightness(app: tauri::AppHandle, level: u32) -> Result<String, String> {
    let level = level.min(100);
    let script = format!(
        "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,{})",
        level
    );

    let output = app
        .shell()
        .command("powershell")
        .args(["-NoProfile", "-NonInteractive", "-Command", &script])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(format!("Brightness set to {}%", level))
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn get_brightness(app: tauri::AppHandle) -> Result<u32, String> {
    let script =
        "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness";

    let output = app
        .shell()
        .command("powershell")
        .args(["-NoProfile", "-NonInteractive", "-Command", script])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    String::from_utf8_lossy(&output.stdout)
        .trim()
        .parse::<u32>()
        .map_err(|_| "Could not parse brightness".to_string())
}

#[tauri::command]
async fn drag_window(window: tauri::Window) -> Result<(), String> {
    window.start_dragging().map_err(|e| e.to_string())
}

#[tauri::command]
async fn close_widget(window: tauri::Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            set_volume,
            get_volume,
            set_brightness,
            get_brightness,
            drag_window,
            close_widget,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}