import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Clients from './pages/Clients'
import AddClient from './pages/AddClient'
import ClientDetail from './pages/ClientDetail'
import AddMaterial from './pages/AddMaterial'
import ImportCsv from './pages/ImportCsv'
import ExportData from './pages/ExportData'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Clients />} />
            <Route path="/clients/new" element={<AddClient />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/add-material" element={<AddMaterial />} />
            <Route path="/import" element={<ImportCsv />} />
            <Route path="/export" element={<ExportData />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
