const leaveRoom = (userId, users) => {
  return users.filter((ele) => ele.id !== userId);
};

export default leaveRoom;
