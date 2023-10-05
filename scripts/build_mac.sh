#!/bin/bash

#npm run build && electron-builder -m -c.extraMetadata.main=build/electron.js
#electron-osx-sign ./dist/WeaveChain-1.0.0.dmg --identity='Developer ID Application: Mana Hours, Inc.' --provisioning-profile=/path/to/yourapp.provisionprofile

#codesign --force --sign "Developer ID Application: Mana Hours, Inc." "./dist/WeaveChain-1.0.0.dmg"

# App Store
#electron-packager . "My App" --platform=mas --arch=x64 --version=0.35.6 --app-bundle-id="com.mysite.myapp" --app-version="1.0.0" --build-version="1.0.100" --osx-sign

electron-packager . "My App" --platform=darwin --arch=x64 --version=0.35.6 --app-bundle-id="com.mysite.myapp" --app-version="1.0.0" --build-version="1.0.100" --osx-sign

