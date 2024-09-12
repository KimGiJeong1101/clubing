const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId);

    if (!user) return next(new Error('Authentication error'));

    socket.request.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

