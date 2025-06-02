import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import NotificationBell from "./NotificationBell";
import Mail from "./Mail";
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
import useLoggedInUser from "../hooks/useLoggedInUser";
import { API_BASE, authHeader1 } from "../api/config";


const NavbarMUI = ({ notifications, onNotificationsUpdate }) => {
  const loggedInUser = useLoggedInUser(); 
  const isAuthenticated = !!loggedInUser; // Convert to boolean
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const unreadCount = notifications?.filter((n) => !n.is_read).length;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/logout/`, {
        method: "POST",
        headers: authHeader1(),
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Remove token from localStorage
        window.location.href = "/"; // Redirect to home page or login page
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("An error occurred while logging out:", err);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read/`, {
        method: "POST",
        headers: {
          ...authHeader1(),
          "Content-Type": "application/json",
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
    <div className="navbar-container container-fluid flex justify-center content-center bg-color-container sticky top-0 z-50 overflow-hidden">
      <div className="container max-w-6xl">
        <AppBar position="static" sx={{ all: "unset" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <div className="flex items-center gap-x-1">
              {/* Menu Icon (Shown only on small screens) */}
              {isSmallScreen && (
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setSidebarOpen(true)}>
                  <MenuIcon sx={{ fontSize: 30 }} />
                </IconButton>
              )}
              <Typography><Link to="/" className="font-bold text-md sm:text-lg whitespace-nowrap">Motueka Task</Link></Typography>
            </div>
  
            <div className="flex">
              {/* Navbar Links (Hidden on small screens) */}
              {!isSmallScreen && (
                // sx={{ display: "flex", gap: 2, alignItems: "center" }}
                <Box className="flex gap-x-4 items-center">
                  {isAuthenticated && (
                    <>
                      <Link to="/mytasks" className="navbar-links font-bold">My Tasks</Link>
                      {loggedInUser?.username && <Link to={`/profile/${loggedInUser?.username}`} className="navbar-links font-bold">My Profile</Link>}
                      <Link to="/mysettings" className="navbar-links font-bold">Settings</Link>
                      <Link to="#" className="navbar-links font-bold" onClick={handleLogout}>Logout</Link>
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
              <Box className="flex justify-center items-center gap-x-0 sm:gap-x-4">
                {isAuthenticated && (
                  <>
                    {/* Show Notification Bell + Mail Icon for authenticated users at all screen sizes */}
                    <Box className="flex justify-center items-center">
                      <NotificationBell notifications={notifications} onNotificationsUpdate={onNotificationsUpdate} />
                      <Mail />
                    </Box>
                  </>
                )}
                <Switch checked={theme === "dark"} onChange={toggleTheme} sx={{ transform: "scale(0.9)" }} />
              </Box>
            </div>
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
                        <ListItemButton component={Link} to={`/profile/${loggedInUser?.username}`} onClick={() => setSidebarOpen(false)}>
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