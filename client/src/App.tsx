import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Arena from "./pages/Arena"
import Arena1 from "./pages/Arena/Arena1"

const App = () => {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arenas" element={<Arena />} />
        <Route path="/arena/:id" element={<Arena1 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
