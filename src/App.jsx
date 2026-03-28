import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import UsersPage from './pages/UsersPage'
import JobsPage from './pages/JobsPage'
import FilesPage from './pages/FilesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/files" element={<FilesPage />} />
      </Routes>
    </BrowserRouter>
  )
}