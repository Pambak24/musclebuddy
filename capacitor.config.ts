import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.christianmusclebuddy.2025',
  appName: 'Muscle Buddy - AI Recovery',
  webDir: 'dist',
  server: {
    url: 'https://419118cb-197f-40b7-86ec-f73e4dc88711.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0ea5e9',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'DARK'
    }
  },
};

export default config;