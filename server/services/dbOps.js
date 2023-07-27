import Message from "../models/Message.js";

async function addMessage(data) {
  try {
    const { room, username, message, createdAt } = data;
    await Message.create({
      room,
      username,
      message,
      createdAt,
    });
  } catch (error) {
    console.error(error);
  }
}

async function getRoomMessages(roomName) {
  try {
    const response = await Message.find({ room: roomName }).sort({
      createdAt: 1,
    });
    // console.log({ response });
    return response;
  } catch (error) {
    console.error(error);
  }
}

export { addMessage, getRoomMessages };
