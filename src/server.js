const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Redis = require('ioredis');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: ["http://localhost:5500"],
        methods: ["GET", "POST"]
      }
 });

const redisCache = new Redis(); 

io.on("connection", (socket) => {
    console.log(`Connected with the client having ID: ${socket.id}`);
    socket.on('setUserId', async (userId) => {
        await redisCache.set(userId, socket.id);
    });

    socket.on('getSocketId', async (userId) => {
        const socketId = await redisCache.get(userId);
        console.log('Server id is', socketId);
        socket.emit('socketId', JSON.stringify(socketId));
    })
});

httpServer.listen(3600, () => {
    console.log(`Server started listening on PORT: 3600`);
});