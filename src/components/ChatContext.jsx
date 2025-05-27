import React, { createContext, useState, useEffect, useContext } from "react";
import { API_BASE, authHeader1 } from "../api/config";

const ChatContext = createContext();

export const ChatProvider = ({ currentUser, children }) => {
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  // Fetch unread message count across all tasks
  const fetchUnreadMessageCount = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/chat/unread/`, {
        headers: { ...authHeader1() },
      });

      if (res.ok) {
        const data = await res.json();  // assume it's a count or list
        setUnreadMessageCount(data.unread_count || 0);
      }
    } catch (err) {
      console.error("❌ Failed to fetch unread chat count:", err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;

    fetchUnreadMessageCount();
    const interval = setInterval(fetchUnreadMessageCount, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <ChatContext.Provider value={{ unreadMessageCount, fetchUnreadMessageCount }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
