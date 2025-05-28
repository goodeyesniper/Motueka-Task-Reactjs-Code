import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import { useChat } from "./ChatContext";
import { useNavigate } from "react-router-dom"; // for navigation
import { API_BASE, authHeader1 } from "../api/config";

const Mail = () => {
  const { unreadMessageCount } = useChat();
  const [anchorEl, setAnchorEl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchUnreadMessages();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchUnreadMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/notifications/chat/unread/messages/`, {
        method: "GET",
        headers: { ...authHeader1() },
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch unread messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (taskId, senderName, senderImage) => {
    navigate(`/mytasks/${taskId}`, {
      state: {
        chattingWith: senderName,
        chattingWithImage: senderImage,
      },
    });
    handleClose();
  };

  if (unreadMessageCount === 0) return null;

  return (
    <>
      <IconButton sx={{ color: "#fb2c36" }} onClick={handleClick}>
        <Badge badgeContent={unreadMessageCount} color="error">
          <MailIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: { width: 300 },
        }}
      >
        {loading ? (
          <MenuItem>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
          </MenuItem>
        ) : messages.length === 0 ? (
          <MenuItem>No new messages</MenuItem>
        ) : (
          messages.map((msg, index) => (
            <MenuItem
              key={index}
              onClick={() => handleMessageClick(msg.task_id, msg.sender_full_name, msg.sender_profile_image)}
            >
              <Avatar src={msg.sender_profile_image} sx={{ mr: 1 }} />
              <div className="ml-2">
                <ListItemText
                  primary={
                    <Typography noWrap fontSize="0.8em">
                      {msg.sender_full_name}
                    </Typography>
                  }
                  secondary={
                    <Typography noWrap fontWeight="bold">
                      {msg.message}
                    </Typography>
                  }
                />
              </div>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default Mail;
