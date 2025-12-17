import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import FeedPage from './pages/feed.jsx'
import ProfilePage from './pages/profile.jsx'
import UserProfile from './pages/userProfile.jsx'
import LoginPage from './pages/login.jsx'
import RegisterPage from './pages/register.jsx'
import './App.css'

function ProfileRoute() {
  const { id } = useParams()
  return <ProfilePage userId={id} />
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-router">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile/:id" element={<ProfileRoute />} />
          <Route path="/me" element={<UserProfile />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
