import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ndnanalytics.app',
  appName: 'NDN Analytics',
  webDir: 'android-web',
  server: {
    url: 'https://www.ndnanalytics.com',
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      releaseType: 'AAB',
    },
  },
};

export default config;
