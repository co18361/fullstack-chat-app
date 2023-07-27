import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectApplicationDb } from "./services/mongoDB.js";
import { addMessage, getRoomMessages } from "./services/dbOps.js";
import leaveRoom from "./utils/leaveRoom.js";
dotenv.config();

const app = express();

const port = process.env.PORT;
const bot = process.env.BOT;
let chatRoom = "";
let roomUsers = [];
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("join-room", (data) => {
    const createdAt = new Date();
    const { room, username } = data;
    socket.join(room);

    socket.to(room).emit("recieve-message", {
      message: `${username} has joined the room`,
      username: bot,
      createdAt,
    });

    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: bot,
      createdAt,
    });

    chatRoom = room;
    roomUsers.push({ id: socket.id, username, room });
    const chatRoomUsers = roomUsers.filter((ele) => ele.room == room);
    socket.to(chatRoom).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
    getRoomMessages(chatRoom)
      .then((response) => {
        socket.emit("room_Messages", response);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  socket.on("send_message", (data) => {
    const { username, message, createdAt, room } = data;
    io.in(room).emit("receive_message", data);
    addMessage({ username, room, createdAt, message })
      .then((response) => {
        console.log(response, "Saved to DB");
      })
      .catch((error) => {
        console.log(error);
      });
  });
  socket.on("leave_room", (data) => {
    const createdAt = new Date();
    const { room, username } = data;
    socket.leave(room);
    roomUsers = leaveRoom(socket.id, roomUsers);
    socket.to(room).emit("chatroom_users", roomUsers);
    socket.to(room).emit("receive_message", {
      message: `${username} has left the room.`,
      username: bot,
      createdAt,
    });
    console.log(`${username} has left the chat.`);
  });
  socket.on("disconnect", () => {
    const user = roomUsers.filter((user) => user.id == socket.id);
    if (user?.username) {
      roomUsers = leaveRoom(socket.id, roomUsers);
      socket.to(room).emit("chatroom_users", roomUsers);
      socket.to(room).emit("receive_message", {
        message: `${username} has been disconnected from the chat.`,
      });
    }
    console.log(`${username} disconnected.`);
  });
});

connectApplicationDb();
server.listen(port, () => console.log("Server is running on port 8080"));
