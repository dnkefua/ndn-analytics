#!/bin/bash
# NDN Analytics - Fix Deployment Script

echo "🔧 Deploying fixes to Firebase..."
echo ""

# Deploy hosting (static files from dist/)
echo "📦 Deploying Hosting..."
firebase deploy --only hosting

# Deploy functions (SSF function with updated assets)
echo ""
echo "⚡ Deploying Functions..."
firebase deploy --only functions:ssr

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Test these URLs:"
echo "  - Homepage: https://ndn-analytics.web.app/"
echo "  - Whitepaper: https://ndn-analytics.web.app/whitepaper"
echo "  - TraceChain: https://ndn-analytics.web.app/products/ndn-005"
echo "  - Njangi: https://ndn-analytics.web.app/products/ndn-009"
echo "  - TraceChain Video: https://ndn-analytics.web.app/assets/tracechain-demo.mp4"
echo "  - Njangi Video: https://ndn-analytics.web.app/assets/njangi-demo.mp4"
