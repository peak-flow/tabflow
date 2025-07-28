#!/bin/bash

# Package TabFlow Chrome Extension for Chrome Web Store

echo "📦 Packaging TabFlow extension..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Create the zip file, excluding unnecessary files
zip -r dist/tabflow.zip . \
  -x "*.git*" \
  -x "dist/*" \
  -x "*.DS_Store" \
  -x "package-extension.sh" \
  -x "STORE_DESCRIPTION.md" \
  -x "README-*.md" \
  -x "screenshots/*" \
  -x "website/*" \
  -x "*.swp" \
  -x "*~" \
  -x "node_modules/*" \
  -x ".gitignore"

echo "✅ Extension packaged successfully!"
echo "📍 Package location: dist/tabflow.zip"
echo ""
echo "📋 Next steps:"
echo "1. Take screenshots of the popup and manager interface"
echo "2. Create promotional graphics (440x280 and 1400x560 pixels)"
echo "3. Upload dist/tabflow.zip to Chrome Web Store Developer Console"
echo "4. Fill in the store listing with the content from STORE_DESCRIPTION.md"
echo "5. Upload screenshots and promotional graphics"
echo "6. Submit for review"
echo ""
echo "Remember to update the author name and homepage URL in manifest.json!"