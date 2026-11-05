const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = withNativewind(getDefaultConfig(__dirname));

// NativeWind redirects every `react-native` import to its className wrapper. Through that
// wrapper `AssetRegistry` is undefined on device, so expo-asset can't load bundled files
// (fonts failed with "Cannot read property 'getAssetByID' of undefined").
// Let the asset packages import the real react-native.
const bypass = [`${path.sep}expo-asset${path.sep}`, `${path.sep}expo-font${path.sep}`];
const nativewindResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native" && bypass.some((p) => context.originModulePath.includes(p))) {
    return context.resolveRequest(context, moduleName, platform);
  }
  return nativewindResolve
    ? nativewindResolve(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
