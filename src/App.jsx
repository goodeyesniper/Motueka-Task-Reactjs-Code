import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Navbar from './components/Navbar'
import BrowseTask from './components/BrowseTask'
import MySettings from './components/MySettings'
import ProfileView from './components/ProfileView'
import MyTasks from './components/MyTasks'
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import ForgotPassword from './components/ForgotPassword'
import ProfileUserView from './components/ProfileUserView'

function App() {

  return (
    <>
      <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="forgotpass" element={<ForgotPassword />} />
          <Route path="/browsetask" element={<BrowseTask />} />
          <Route path="/mysettings" element={<MySettings />} />
          <Route path="/profile" element={<ProfileView />}/>
          <Route path="/profileuser/:username" element={<ProfileUserView />}/>
          <Route path="/mytasks" element={<MyTasks />}/>
        </Routes>
    </>
  )
}

export default App

