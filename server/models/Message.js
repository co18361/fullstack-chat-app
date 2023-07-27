import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  room: { type: String },
  message: { type: String },
  username: { type: String },
  createdAt: { type: Date },
});

export default mongoose.model("Message", Schema, "Message");
