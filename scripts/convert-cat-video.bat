@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set SRC=d:\AI视频\真人英语\第八集\666.mov
set OUT=%~dp0..\assets\video

if not "%~1"=="" set SRC=%~1

where ffmpeg >nul 2>&1
if errorlevel 1 (
  echo 请先安装 ffmpeg：winget install Gyan.FFmpeg
  exit /b 1
)

if not exist "%SRC%" (
  echo 找不到文件: %SRC%
  exit /b 1
)

echo 检测素材是否已有透明通道...
for /f "delims=" %%i in ('ffprobe -v error -select_streams v:0 -show_entries stream^=pix_fmt -of csv^=p^=0 "%SRC%"') do set PIXFMT=%%i
echo 像素格式: !PIXFMT!

set VF=scale=320:320:force_original_aspect_ratio=decrease,pad=320:320:(ow-iw)/2:(oh-ih)/2,format=rgba
echo !PIXFMT! | findstr /i "yuva rgba argb bgra ya" >nul
if !errorlevel! equ 0 (
  echo [模式] 透明通道素材，直接保留 Alpha（无需绿幕抠图）
) else (
  echo [模式] 绿幕素材，自动抠绿
  set VF=chromakey=0x00FF00:0.32:0.08,!VF!
)

echo.
echo [1/3] 透明 WebP 动图（预览+真机主格式）...
ffmpeg -y -i "%SRC%" -vf "!VF!,fps=15" -c:v libwebp -lossless 0 -compression_level 4 -q:v 80 -loop 0 -an "%OUT%\cat-idle.webp"

echo [2/3] 透明 GIF 动图（真机备用）...
ffmpeg -y -i "%SRC%" -vf "!VF!,fps=15,split[s0][s1];[s0]palettegen=reserve_transparent=1:stats_mode=single[p];[s1][p]paletteuse=alpha_threshold=128" -loop 0 -an "%OUT%\cat-idle.gif"

echo [3/3] mp4 备用（滤色去黑底）...
ffmpeg -y -i "%SRC%" -vf "!VF!,format=yuv420p,fps=15" -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -g 15 -bf 0 -movflags +faststart -an "%OUT%\cat-idle.mp4"

echo.
echo 完成！文件已输出到 %OUT%
echo.
echo --- 推荐：直接给我透明背景素材 ---
echo 剪映导出时开启「透明背景」，得到 .mov 或 .webm 后发给我
echo 运行: scripts\convert-cat-video.bat "你的透明视频路径"
echo 会自动识别透明通道，不会二次抠图，边缘更干净
