const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const redis = require('redis');

// Initialize Redis client
const redisClient = redis.createClient();
redisClient.connect();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb+srv://abdelrahmank8128:000000000010Aa@cluster0.ogteq8x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const DriverSchema = new mongoose.Schema({
  name: String,
  available: Boolean,
  location: {
    lat: Number,
    lng: Number,
  },
  startTime: Number,
  totalActiveTime: Number,
});

const Driver = mongoose.model('Driver', DriverSchema);

// Real-time socket handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle driver location updates
  socket.on('update_driver_location', async (data) => {
    const { driverId, location } = data;

    // Update location in DB
    await Driver.findByIdAndUpdate(driverId, {
      $set: { location: location },
    });

    // Optionally store in Redis for faster access
    await redisClient.hSet('driverLocations', driverId, JSON.stringify(location));

    // Broadcast the location update to the admin
    io.emit('driver_location_update', { driverId, location });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
