import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Businesses from './pages/Businesses'
import BusinessDetail from './pages/BusinessDetail'
import Login from './pages/Login'
import AddBusiness from './pages/AddBusiness'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-business" element={<AddBusiness />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
