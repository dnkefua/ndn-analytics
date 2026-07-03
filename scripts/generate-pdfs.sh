#!/bin/bash
# PDF Generation Script for Lead Magnets
# Converts HTML lead magnet templates to professional PDFs
# Requires: chromium/puppeteer installed globally

set -e

PDF_DIR="public/downloads"
HTML_DIR="public/downloads"

echo "🔄 Converting lead magnet HTML files to PDF..."

# List of HTML files to convert
MAGNETS=(
  "NDN-AI-Demand-Forecasting-Checklist"
  "NDN-Blockchain-Supply-Chain-ROI-Guide"
)

for magnet in "${MAGNETS[@]}"; do
  HTML_FILE="$HTML_DIR/$magnet.html"
  PDF_FILE="$PDF_DIR/$magnet.pdf"

  if [ ! -f "$HTML_FILE" ]; then
    echo "⚠️  File not found: $HTML_FILE"
    continue
  fi

  echo "📄 Converting: $magnet.html → $magnet.pdf"

  # Using Puppeteer/Chrome for PDF conversion
  # Install: npm install -g puppeteer
  npx puppeteer launch-browser --product=chrome \
    --evaluate "
      const page = await browser.newPage();
      await page.goto('file://$PWD/$HTML_FILE', { waitUntil: 'networkidle0' });
      await page.pdf({
        path: '$PDF_FILE',
        format: 'A4',
        margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
        printBackground: true,
        preferCSSPageSize: true
      });
      await browser.close();
    " || echo "⚠️  Conversion failed for $magnet - ensure Puppeteer is installed"
done

echo "✅ PDF conversion complete!"
echo "📦 PDFs available at: $PDF_DIR/"
