import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./pages/chat";

const socket = io.connect("http://localhost:8080");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setUsername={setUsername}
                username={username}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          <Route
            path="/chat"
            element={<Chat room={room} socket={socket} username={username} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
