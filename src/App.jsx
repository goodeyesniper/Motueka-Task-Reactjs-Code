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
import TaskView from './components/TaskView'
import ProtectedRoute from "./components/ProtectedRoute";


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
          <Route path="/profile/:username" element={<ProfileView />}/>
          <Route path="/profileuser/:username" element={<ProfileUserView />}/>

          <Route path="/mysettings" element={<ProtectedRoute><MySettings /></ProtectedRoute>} />
          <Route path="/mytasks" element={<MyTasks />} />
          <Route path="/mytasks/:taskId" element={<TaskView />} />
        </Routes>
    </>
  )
}

export default App

