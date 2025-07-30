import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'MuscleB', 
  webDir: 'dist',
  server: {
    url: 'https://419118cb-197f-40b7-86ec-f73e4dc88711.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;