# Upload videos to Firebase Storage (PowerShell)
# Usage: .\upload-videos.ps1

$PROJECT_ID = "ndn-analytics"
$BUCKET = "${PROJECT_ID}.appspot.com"

# Check if gsutil is available
$gsutil = Get-Command gsutil -ErrorAction SilentlyContinue
if (-not $gsutil) {
    Write-Host "⚠️  gsutil not found. Please install Google Cloud SDK:" -ForegroundColor Yellow
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    exit 1
}

Write-Host "📤 Uploading videos to Firebase Storage..." -ForegroundColor Cyan
Write-Host "Bucket: gs://${BUCKET}/videos/" -ForegroundColor Gray
Write-Host ""

# Upload TraceChain video
Write-Host "Uploading tracechain-demo.mp4..." -ForegroundColor Green
& gsutil -m cp -h "Cache-Control:public, max-age=31536000" `
    "dist/assets/tracechain-demo.mp4" `
    "gs://${BUCKET}/videos/tracechain-demo.mp4"

# Upload Njangi video  
Write-Host "Uploading njangi-demo.mp4..." -ForegroundColor Green
& gsutil -m cp -h "Cache-Control:public, max-age=31536000" `
    "dist/assets/njangi-demo.mp4" `
    "gs://${BUCKET}/videos/njangi-demo.mp4"

# Make them publicly readable
Write-Host ""
Write-Host "🔓 Setting public access..." -ForegroundColor Yellow
& gsutil acl ch -u AllUsers:R "gs://${BUCKET}/videos/tracechain-demo.mp4"
& gsutil acl ch -u AllUsers:R "gs://${BUCKET}/videos/njangi-demo.mp4"

Write-Host ""
Write-Host "✅ Upload complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Video URLs:"
Write-Host "  TraceChain: https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/videos%2Ftracechain-demo.mp4?alt=media" -ForegroundColor Cyan
Write-Host "  Njangi:     https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/videos%2Fnjangi-demo.mp4?alt=media" -ForegroundColor Cyan
