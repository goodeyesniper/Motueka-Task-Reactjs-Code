import { useLocation, useParams } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";
import Chatbox from "./Chatbox";

const ChatWrapper = () => {
  const { taskId } = useParams();
  const { state } = useLocation();
  const currentUser = useLoggedInUser();

  if (!currentUser) return null; // or loading spinner

  return (
    <Chatbox
      taskId={taskId}
      currentUser={currentUser}
      taskStatus="assigned"
      chattingWith={state?.chattingWith}
      chattingWithImage={state?.chattingWithImage}
    />
  );
};

export default ChatWrapper;
