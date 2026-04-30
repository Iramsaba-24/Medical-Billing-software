import { authRoutes } from '@/routes/AuthenticationRoutes';
import { mainRoutes } from '@/routes/MainRoutes';
import { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';

function App() {
 useEffect(() => {
    // Check if running in Electron
    if (window.ipcRenderer) {
      window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log("Received:", message)
      })
    }
  }, [])
  
  const routes = useRoutes([...authRoutes, ...mainRoutes]);
  return routes;
}

export default App;

