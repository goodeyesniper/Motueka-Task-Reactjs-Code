import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import BrowseTask from './components/BrowseTask'
import MySettings from './components/MySettings'
import ProfileView from './components/ProfileView'
import MyTasks from './components/MyTasks'
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import ForgotPassword from './components/ForgotPassword'
// import ProfileUserView from './components/ProfileUserView'
import TaskView from './components/TaskView'
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import { fetchUserNotifications } from "./api/notifications"; // Import API utility
import useLoggedInUser from './hooks/useLoggedInUser';
import NavbarMUI from './components/NavbarMUI'
import ChatWrapper from "./components/ChatWrapper";


function App({ currentUser }) {
  const [notificationBell, setNotificationBell] = useState([]);
  // const currentUser = useLoggedInUser();

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.username) return;
    const data = await fetchUserNotifications(currentUser.username);
    setNotificationBell(data);
  };

  // Centralized Notification Fetch
  useEffect(() => {
    if (currentUser === null) {
      return; // Stop execution early when logged out
    }
    if (!currentUser || !currentUser.username) {
      console.warn("Skipping notification fetch: Invalid currentUser");
      return;
    }
    fetchNotifications();
  }, [currentUser]); // Runs whenever `currentUser` changes
  
  return (
    <>
      {/* <Navbar notifications={notificationBell} /> */}
      <NavbarMUI notifications={notificationBell} onNotificationsUpdate={fetchNotifications} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="forgotpass" element={<ForgotPassword />} />
          <Route path="/browsetask" element={<BrowseTask />} />
          <Route path="/profile/:username" element={<ProfileView />}/>
          {/* <Route path="/profileuser/:username" element={<ProfileUserView />}/> */}
          <Route path="/mysettings" element={<ProtectedRoute><MySettings notifications={notificationBell} setNotificationBell={setNotificationBell} /></ProtectedRoute>} />
          <Route path="/mytasks" element={<MyTasks />} />
          <Route path="/mytasks/:taskId" element={<TaskView setNotificationBell={setNotificationBell} />} />
          <Route path="/chat/:taskId" element={<ChatWrapper />} />
        </Routes>
    </>
  )
}

export default App

