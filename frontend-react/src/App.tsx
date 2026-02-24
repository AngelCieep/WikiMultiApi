import { HomeBar } from './components/homeBar/homeBar'
import { WiiGame } from './components/wiiGame/wiiGame'
import './App.css'

function App() {
  return (
    <div className="wii-menu">
      <WiiGame />
      <HomeBar />
    </div>
  )
}

export default App
