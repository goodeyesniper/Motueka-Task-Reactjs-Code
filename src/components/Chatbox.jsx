import { useState, useEffect, useRef } from "react";
import { Box, IconButton, TextField, Button, Avatar } from "@mui/material";
import { borderRadius, keyframes } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { API_BASE, authHeader1 } from "../api/config";
import useMediaQuery from "@mui/material/useMediaQuery";
import Badge from "@mui/material/Badge";
import { useChat } from "./ChatContext";


const ChatBox = ({ taskId, currentUser, taskStatus, chattingWith, chattingWithImage }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatMessageCount, setChatMessageCount] = useState(0)
  const { fetchUnreadMessageCount } = useChat();

  useEffect(() => {
    fetchUnreadMessageCount();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchNewMessageCount();
    }, 10000);  // Check for updates every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchNewMessageCount = async () => {
    const response = await fetch(`${API_BASE}/notifications/chat/${taskId}/`, {
      method: "GET",
      headers: { ...authHeader1() },
    });
    const data = await response.json();

    if (data.length > 0) {
      setUnreadCount(data.filter((msg) => !msg.is_read && msg.sender_id !== currentUser.id).length);
      if (!isOpen) return; // Don't fetch full messages unless chat is open
      fetchMessages();
    }
  };

  const markMessagesAsRead = async () => {
    try {
      const response = await fetch(`${API_BASE}/notifications/chat/${taskId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeader1(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }

      if (setChatMessageCount) {
        setChatMessageCount(prev => Math.max(0, prev - unreadCount)); // Prevent negative
      }

      console.log("✅ Messages marked as read");
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    const response = await fetch(`${API_BASE}/notifications/chat/${taskId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader1(),
      },
      body: JSON.stringify({ message: messageInput }),
    });

    if (response.ok) {
      setMessageInput("");
      fetchMessages();
    } else {
      console.error("Error sending message");
    }
  };

  const fetchMessages = async () => {
    const response = await fetch(`${API_BASE}/notifications/chat/${taskId}/`, {
      method: "GET",
      headers: { ...authHeader1() },
    });

    if (response.ok) {
      const data = await response.json();
      setMessages(data);
    } else {
      console.error("Error fetching messages");
    }
  };

  useEffect(() => {
    if (taskStatus === "assigned") {
      fetchMessages();
    }
  }, [taskId, taskStatus]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      markMessagesAsRead();
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && chatMessageCount > 0) {
      fetchMessages();
    }
  }, [chatMessageCount]);

  // New useEffect for scrolling when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" }); // ✅ Scrolls instantly
  }, [messages]);

  const otherUserMsg = messages.find((msg) => msg.sender_id !== currentUser.id);
  const otherUserName = otherUserMsg?.sender_full_name || "User";
  const otherUserImage = otherUserMsg?.sender_profile_image || null;

  const glowAnimation = keyframes`
    0% {
      box-shadow: 0 0 10px rgba(0, 122, 255, 0.7), 0 0 20px rgba(0, 122, 255, 0.5);
    }
    50% {
      box-shadow: 0 0 25px rgba(0, 122, 255, 0.9), 0 0 40px rgba(0, 122, 255, 0.6);
    }
    100% {
      box-shadow: 0 0 10px rgba(0, 122, 255, 0.7), 0 0 20px rgba(0, 122, 255, 0.5);
    }
  `;


  return (
    <>
      {/* Floating Chat Icon */}
      {taskStatus === "assigned" && !isOpen && (
        <IconButton
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
            setTimeout(scrollToBottom, 100);
          }}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            backgroundColor: "#007AFF",
            color: "white",
            fontWeight: "800",
            animation: `${glowAnimation} 1.5s infinite ease-in-out`,
            "&:hover": { backgroundColor: "#005FCC" },
          }}
        >
          <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
            <Avatar sx={{ bgcolor: "#005FCC" }}>
              {chattingWith?.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
        </IconButton>
      )}

      {/* Chat Box */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            right: isSmallScreen ? 0 : 16,
            left: isSmallScreen ? 0 : "auto",
            width: isSmallScreen ? "100vw" : 330,
            height: isSmallScreen ? "100vh" : 450,
            backgroundColor: "white",
            borderRadius: isSmallScreen ? 0 : 2,
            boxShadow: 4,
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Avatar and Close */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderBottom: "1px solid #ddd",
              bgcolor: "#155dfc",
              color: "#fff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={chattingWithImage}>
                {chattingWith?.charAt(0).toUpperCase()}
              </Avatar>
              <strong>{chattingWith}</strong>
            </Box>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>

            {/* Chat Messages */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
                >
                {messages.map((msg, idx) => {
                    const isOwnMessage = msg.sender_id === currentUser.id;

                    return (
                    <Box
                        key={idx}
                        sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                        }}
                    >
                        {isOwnMessage ? (
                        // RIGHT: Your own message
                        <Box
                            sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 1,
                            flexDirection: "row-reverse",
                            }}
                        >
                            {/* <Avatar
                            src={chattingWithImage || undefined}
                            alt="You"
                            sx={{ width: 32, height: 32 }}
                            /> */}
                            <Box
                            sx={{
                                maxWidth: 220,
                                p: 1,
                                borderRadius: 2,
                                bgcolor: "#DCF8C6", // light green
                                color: "#000",
                                wordWrap: "break-word",
                            }}
                            >
                            <div style={{ fontSize: "0.85em", color: "#6a7282" }}>You</div>
                            <div>{msg.message}</div>
                            </Box>
                        </Box>
                        ) : (
                        // LEFT: Other user's message
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                            <Avatar
                            src={otherUserImage || undefined}
                            alt={otherUserName}
                            sx={{ width: 32, height: 32 }}
                            />
                            <Box
                            sx={{
                                maxWidth: 220,
                                p: 1,
                                borderRadius: 2,
                                bgcolor: "#dbeafe", // light gray
                                color: "#000",
                                wordWrap: "break-word",
                            }}
                            >
                            {/* Replace username with full name */}
                            <div style={{ fontSize: "0.85em", color: "#6a7282" }}>
                                {otherUserName}
                            </div>
                            <div>{msg.message}</div>
                            </Box>
                        </Box>
                        )}
                    </Box>
                    );
                })}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
                </Box>

            {/* Input Field */}
            <Box sx={{ p: 1, borderTop: "1px solid #ddd" }}>
              <form
                onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                sendMessage();
                }}
              >
                <div className="flex justify-between items-center mb-1 gap-x-2">
                  <div className="w-full">
                    <TextField
                      fullWidth
                      multiline
                      minRows={1}
                      maxRows={4}
                      variant="outlined"
                      label="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      size="small"
                      onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // Prevent newline and send message
                          sendMessage();
                          }
                          // Shift+Enter will allow default behavior (newline)
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      // fullWidth
                      variant="contained"
                      type="submit"
                      disabled={!messageInput.trim()}
                      sx={{ borderRadius: "5px", height: "36px" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> 
                        <path fill="currentcolor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </form>
            </Box>
        </Box>
      )}
    </>
  );
};

export default ChatBox;
