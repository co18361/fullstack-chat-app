import styles from "./styles.module.css";
import Messages from "./messages";
import SendMessage from "./send-message";
import UserListAndRoomName from "./userList";

const Chat = ({ socket, username, room }) => {
  return (
    <div className={styles.chatContainer}>
      <UserListAndRoomName socket={socket} username={username} room={room} />
      <div>
        <Messages socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
