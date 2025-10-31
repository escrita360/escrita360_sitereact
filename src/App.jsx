import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import ParaQuem from './pages/ParaQuem.jsx'
import Recursos from './pages/Recursos.jsx'
import Precos from './pages/Planos.jsx'
import Contato from './pages/Contato.jsx'
import Faq from './pages/Faq.jsx'
import Pagamento from './pages/Pagamento.jsx'
import PagamentoSucesso from './pages/PagamentoSucesso.jsx'
import PagamentoCancelado from './pages/PagamentoCancelado.jsx'
import './App.css'

function App() {
  const location = useLocation()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          </Layout>
        } />
        <Route path="/para-quem" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ParaQuem />
            </motion.div>
          </Layout>
        } />
        <Route path="/recursos" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Recursos />
            </motion.div>
          </Layout>
        } />
        <Route path="/faq" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Faq />
            </motion.div>
          </Layout>
        } />
        <Route path="/precos" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Precos />
            </motion.div>
          </Layout>
        } />
        <Route path="/contato" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Contato />
            </motion.div>
          </Layout>
        } />
        <Route path="/pagamento" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Pagamento />
            </motion.div>
          </Layout>
        } />
        <Route path="/payment/success" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PagamentoSucesso />
            </motion.div>
          </Layout>
        } />
        <Route path="/payment/cancel" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PagamentoCancelado />
            </motion.div>
          </Layout>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default App

