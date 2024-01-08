const websocket = require('./webSocket');
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const http = require('http');

require('dotenv').config();
//require('dotenv').config({ path: '.env.local' }); 

const app = express();
const server = http.createServer(app);
websocket.init(server);

// Routes
const userRoutes = require('./routes/UserRoute');
const followerRoutes = require('./routes/FollowRoute');
const tweetRoutes = require("./routes/TweetRoutes");
const replyRoutes = require("./routes/ReplyRoute");
const likeRoutes = require("./routes/LikeRoute");

// MongoDB Connection
const DATABASE = process.env.MONGO_URI;
mongoose.connect(DATABASE)
.then(() => {
    console.log("Database connected");
})
.catch((err) => {
    console.error("Database connection error:", err);
});

// Middleware
app.use(cookieParser());
app.use(express.json());
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(helmet());
// API Routes
app.use('/api/users', userRoutes);
app.use('/api/followData', followerRoutes);
app.use('/api/tweet', tweetRoutes);
app.use('/api/reply', replyRoutes);
app.use('/api/like', likeRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(process.env.CORS_ORIGIN);
    console.log(`Server started on port ${PORT}`);
});


