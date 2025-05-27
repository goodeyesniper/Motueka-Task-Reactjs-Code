import React from "react";
import IconButton from "@mui/material/IconButton";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import { useChat } from "./ChatContext";

const Mail = () => {
  const { unreadMessageCount } = useChat();

  if (unreadMessageCount === 0) return null;

  return (
    <IconButton sx={{ color: "#fb2c36" }}>
      <Badge badgeContent={unreadMessageCount} color="error">
        <MailIcon />
      </Badge>
    </IconButton>
  );
};

export default Mail;
