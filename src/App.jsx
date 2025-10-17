import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ParaQuem from './pages/ParaQuem.jsx'
import Recursos from './pages/Recursos.jsx'
import Precos from './pages/Precos.jsx'
import Contato from './pages/Contato.jsx'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/para-quem" element={<Layout><ParaQuem /></Layout>} />
      <Route path="/recursos" element={<Layout><Recursos /></Layout>} />
      <Route path="/precos" element={<Layout><Precos /></Layout>} />
      <Route path="/contato" element={<Layout><Contato /></Layout>} />
    </Routes>
  )
}

export default App

