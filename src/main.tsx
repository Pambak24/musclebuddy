import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SplashScreen } from '@capacitor/splash-screen'

// Hide splash screen when app is ready
const hideSplash = async () => {
  try {
    await SplashScreen.hide()
  } catch (error) {
    console.log('SplashScreen not available:', error)
  }
}

createRoot(document.getElementById("root")!).render(<App />);

// Hide splash screen after app renders
setTimeout(hideSplash, 100);
