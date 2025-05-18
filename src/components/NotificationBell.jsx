import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { API_BASE, authHeader1 } from "../api/config";
import { useNavigate } from "react-router-dom";


// Replace this with your actual API call function
const markNotificationAsRead = async (id) => {
  try {
    await fetch(`${API_BASE}/notifications/${id}/read/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader1(),
      },
      body: JSON.stringify({}) // ✅ even if the body is empty
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
  
};

// Transfered to App.jsx for global call
// const fetchNotifications = async () => {
//   const response = await fetch(`${API_BASE}/notifications/`, {
//     headers: authHeader1(),
//   });
//   const data = await response.json();
//   setNotifications(data);
// };

const NotificationBell = ({ notifications = [], onNotificationsUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <div className="relative">
        <IconButton color="warning" onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 },
          }}
        >
          <Box px={2} py={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              <RouterLink to="/mysettings?tab=Notifications">Notifications</RouterLink>
            </Typography>
          </Box>
          <Divider />

          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={async () => {
                  if (!notification.is_read) {
                    await markNotificationAsRead(notification.id);
                    await onNotificationsUpdate?.();
                  }
                  handleClose();
                  if (notification.task_id) {
                    navigate(`/mytasks/${notification.task_id}`);
                  }
                }}
                sx={{
                  whiteSpace: "normal",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={notification.is_read ? "normal" : "bold"}
                >
                  {notification.message}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <Typography variant="body2" color="textSecondary">
                No notifications to show
              </Typography>
            </MenuItem>
          )}

          <Divider />
          <MenuItem
            component={RouterLink}
            to="/mysettings?tab=Notifications"
            onClick={handleClose}
          >
            <Typography variant="body2" color="primary">
              View all
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default NotificationBell;
