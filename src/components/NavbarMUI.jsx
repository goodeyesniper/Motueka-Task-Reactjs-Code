import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext"; // Adjust path if needed
import NotificationBell from "./NotificationBell";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from '@mui/material/ListItemButton';
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import Badge from "@mui/material/Badge";
import { Button } from '@mui/material';

const NavbarMUI = ({ notifications, onNotificationsUpdate }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const unreadCount = notifications?.filter((n) => !n.is_read).length;


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = "http://127.0.0.1:8000/api/current-user/";
        const headers = token ? { Authorization: `Token ${token}` } : {};
        const response = await fetch(url, { headers });

        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("An error occurred while logging out:", err);
    }
  };

  const handleMarkAsRead = async () => {
  try {
    const token = localStorage.getItem("token");
    await fetch("http://127.0.0.1:8000/api/notifications/mark-all-read/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });

    // Refresh notifications state
    await onNotificationsUpdate?.();

  } catch (err) {
    console.error("Failed to mark notifications as read:", err);
  } finally {
    setSidebarOpen(false);
  }
};


  return (
    <div className="navbar-container container-fluid flex justify-center content-center bg-color-container sticky top-0 z-50">
      <div className="container max-w-6xl">
        <AppBar position="static" sx={{ all: "unset" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Menu Icon (Shown only on small screens) */}
            {isSmallScreen && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setSidebarOpen(true)}>
                <MenuIcon sx={{ fontSize: 30 }} />
              </IconButton>
            )}

            <Typography variant="h6"><Link to="/" className="font-bold">Motueka Task</Link></Typography>

            {/* Navbar Links (Hidden on small screens) */}
            {!isSmallScreen && (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {isAuthenticated && (
                  <>
                    <Link to="/mytasks" className="navbar-links font-bold">My Tasks</Link>
                    {profile?.username && <Link to={`/profile/${profile.username}`} className="navbar-links font-bold">My Profile</Link>}
                    <Link to="/mysettings" className="navbar-links font-bold">Settings</Link>
                    <Link to="#" className="navbar-links font-bold" onClick={handleLogout}>Logout</Link>
                    <NotificationBell notifications={notifications} onNotificationsUpdate={onNotificationsUpdate} />
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <div className="flex gap-x-5">
                      <Button component={Link} to="/register" className="custom-btn-container custom-btn px-2">Sign Up</Button>
                      <Link to="/login" className="navbar-links">Login</Link>
                    </div>
                    
                  </>
                )}
              </Box>
            )}

            {/* Theme Toggle */}
            <Switch checked={theme === "dark"} onChange={toggleTheme} sx={{ transform: "scale(0.9)" }} />
          </Toolbar>
        </AppBar>

        {/* Sidebar (Menu for small screens) */}
        <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          <Box sx={{ width: 250 }} role="presentation">
            <List>
              {isAuthenticated ? (
                <>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/mytasks" onClick={() => setSidebarOpen(false)}>
                            <ListItemText primary="My Tasks" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to={`/profile/${profile?.username}`} onClick={() => setSidebarOpen(false)}>
                            <ListItemText primary="My Profile" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/mysettings" onClick={() => setSidebarOpen(false)}>
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={Link}
                        to="/mysettings?tab=Notifications"
                        onClick={handleMarkAsRead}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <span>Notifications</span>
                              {unreadCount > 0 && (
                                <Badge badgeContent={unreadCount} color="error" />
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </>
              ) : (
                <>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/register" onClick={() => setSidebarOpen(false)}>
                            <ListItemText primary="Sign Up" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/login" onClick={() => setSidebarOpen(false)}>
                            <ListItemText primary="Login" />
                        </ListItemButton>
                    </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </div>
    </div>
  );
};

export default NavbarMUI;