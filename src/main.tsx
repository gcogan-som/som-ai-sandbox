import ReactDOM from 'react-dom/client'
import { Provider as JotaiProvider } from 'jotai'
import App from './App'
import './index.css'
import { startDeployVersionWatcher } from './versionCheck'

startDeployVersionWatcher()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <JotaiProvider>
    <App />
  </JotaiProvider>
)
