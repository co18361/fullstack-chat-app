import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

const Messages = ({ socket }) => {
  const [messagesRecieved, setMessagesRecieved] = useState([]);
  const messagesColumnRef = useRef(null);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      const { username, message } = data;
      setMessagesRecieved((currentMessages) => [
        ...currentMessages,
        { message, username, createdAt: new Date() },
      ]);
    });
    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    socket.on("room_Messages", (response) => {
      // console.log({ response });
      setMessagesRecieved((currentMessages) => [
        ...response,
        ...currentMessages,
      ]);
    });

    return () => socket.off("room_Messages");
  }, [socket]);

  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);

  function formatDateFromTimestamp(time) {
    return new Date(time).toLocaleString();
  }

  return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
      {messagesRecieved.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.createdAt)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
