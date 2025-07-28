import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.419118cb197f40b786ecf73e4dc88711',
  appName: 'Muscle Buddy',
  webDir: 'dist',
  server: {
    url: 'https://419118cb-197f-40b7-86ec-f73e4dc88711.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
};

export default config;