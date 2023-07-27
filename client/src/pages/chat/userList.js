import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

const UserListAndRoomName = ({ room, username, socket }) => {
  const [roomUsers, setRoomUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("chatroom_users", (data) => {
      // console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off("chatroom_users");
  }, [socket]);

  function leaveRoom() {
    const createdAt = new Date();
    socket.emit("leave_room", { username, room, createdAt });
    navigate("/", { replace: true });
  }

  return (
    <div className={styles.roomAndUsersColumn}>
      <h2 className={styles.userTiles}>{room}</h2>
      <div>
        {roomUsers.length > 0 && (
          <h5 className={styles.usersTitle}> Users: </h5>
        )}
        <ul style={styles.userList}>
          {roomUsers.map((user) => {
            return (
              <li
                key={user.id}
                style={{
                  fontWeight: `${
                    user.username === username ? "bold" : "normal"
                  }`,
                }}
              >
                {user.username}
              </li>
            );
          })}
        </ul>
      </div>
      <button className="btn btn-outline" onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

export default UserListAndRoomName;
