#!/bin/bash
# Upload videos to Firebase Storage
# Usage: ./upload-videos-to-storage.sh

PROJECT_ID="ndn-analytics"
BUCKET="${PROJECT_ID}.appspot.com"

# Check if gsutil is available
if ! command -v gsutil &> /dev/null; then
    echo "⚠️  gsutil not found. Installing Google Cloud SDK..."
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "📤 Uploading videos to Firebase Storage..."
echo "Bucket: gs://${BUCKET}/videos/"
echo ""

# Create videos directory if needed
# Upload TraceChain video
echo "Uploading tracechain-demo.mp4..."
gsutil -m cp -h "Cache-Control:public, max-age=31536000" \
    dist/assets/tracechain-demo.mp4 \
    "gs://${BUCKET}/videos/tracechain-demo.mp4"

# Upload Njangi video
echo "Uploading njangi-demo.mp4..."
gsutil -m cp -h "Cache-Control:public, max-age=31536000" \
    dist/assets/njangi-demo.mp4 \
    "gs://${BUCKET}/videos/njangi-demo.mp4"

# Make them publicly readable
echo ""
echo "🔓 Setting public access..."
gsutil acl ch -u AllUsers:R "gs://${BUCKET}/videos/tracechain-demo.mp4"
gsutil acl ch -u AllUsers:R "gs://${BUCKET}/videos/njangi-demo.mp4"

echo ""
echo "✅ Upload complete!"
echo ""
echo "Video URLs:"
echo "  TraceChain: https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/videos%2Ftracechain-demo.mp4?alt=media"
echo "  Njangi:     https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/videos%2Fnjangi-demo.mp4?alt=media"
