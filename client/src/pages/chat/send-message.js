import styles from "./styles.module.css";
import { useState } from "react";

const SendMessage = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");

  function sendMessage() {
    if (message !== "") {
      const createdAt = new Date();
      socket.emit("send_message", { username, room, message, createdAt });
      setMessage("");
    }
  }

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        value={message}
        placeholder="type..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="btn btn-primary" onClick={sendMessage}>Send </button>
    </div>
  );
};

export default SendMessage;
