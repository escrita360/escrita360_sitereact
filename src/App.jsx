import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import Layout from './components/Layout.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Home from './pages/Home.jsx'
import ParaQuem from './pages/ParaQuem.jsx'
import Recursos from './pages/Recursos.jsx'
import Precos from './pages/Planos.jsx'
import Contato from './pages/Contato.jsx'
import Faq from './pages/Faq.jsx'
import Login from './pages/Login.jsx'
import Pagamento from './pages/Pagamento.jsx'
import PagamentoCreditos from './pages/PagamentoCreditos.jsx'
import ComprarCreditos from './pages/ComprarCreditos.jsx'
import PagamentoResultado from './pages/PagamentoResultado.jsx'
import PagBankSandbox from './pages/PagBankSandbox.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminSubscriptions from './pages/admin/AdminSubscriptions.jsx'
import AdminPayments from './pages/admin/AdminPayments.jsx'
import AdminPagBank from './pages/admin/AdminPagBank.jsx'
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
        <Route path="/pagamento-creditos" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PagamentoCreditos />
            </motion.div>
          </Layout>
        } />
        <Route path="/comprar-creditos" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ComprarCreditos />
            </motion.div>
          </Layout>
        } />
        <Route path="/pagamento-sucesso" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PagamentoResultado status="success" />
            </motion.div>
          </Layout>
        } />
        <Route path="/pagamento-cancelado" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PagamentoResultado status="cancelled" />
            </motion.div>
          </Layout>
        } />
        <Route path="/sandbox/pagbank" element={
          <Layout>
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <PagBankSandbox />
            </motion.div>
          </Layout>
        } />
        <Route path="/login" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Login />
          </motion.div>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <Layout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminDashboard />
              </motion.div>
            </Layout>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <Layout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminUsers />
              </motion.div>
            </Layout>
          </AdminRoute>
        } />
        <Route path="/admin/subscriptions" element={
          <AdminRoute>
            <Layout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminSubscriptions />
              </motion.div>
            </Layout>
          </AdminRoute>
        } />
        <Route path="/admin/payments" element={
          <AdminRoute>
            <Layout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminPayments />
              </motion.div>
            </Layout>
          </AdminRoute>
        } />
        <Route path="/admin/pagbank" element={
          <AdminRoute>
            <Layout>
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminPagBank />
              </motion.div>
            </Layout>
          </AdminRoute>
        } />
        <Route path="/admin/login" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Login />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default App

