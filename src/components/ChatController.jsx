import React, { useState } from "react";
import Mail from "./Mail";
import ChatBox from "./Chatbox";

const ChatController = ({ currentUser, taskId, openChat, chatWith, recipientImage }) => {
  const [isChatBoxOpen, setChatBoxOpen] = useState(openChat || false);
  const [chatWithUser, setChatWithUser] = useState(chatWith || '');
  const [chatRecipientImage, setChatRecipientImage] = useState(recipientImage || '');

  // Function to update both user and image at once
  const setChatParams = (user, image) => {
    setChatWithUser(user);
    setChatRecipientImage(image);
    setChatBoxOpen(true);
  };

  return (
    <>
      <Mail
        setIsChatOpen={setChatBoxOpen}
        setChatParams={setChatParams}
      />
      <ChatBox
        taskId={taskId}
        currentUser={currentUser}
        isOpen={isChatBoxOpen}
        setIsOpen={setChatBoxOpen}
        chattingWith={chatWithUser}
        chattingWithImage={chatRecipientImage}
      />
    </>
  );
};

export default ChatController;
