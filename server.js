const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, { 
    cors: { origin: "*" } 
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'elevate-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// Socket.io - säkra vidarebefordran till ALLA (io.emit)
io.on('connection', (socket) => {
  console.log('🔗 Ny anslutning:', socket.id);

  socket.on('send_message', (data) => {
    console.log('💬 Nytt chattmeddelande:', data);
    io.emit('receive_message', data);
  });

  socket.on('admin_workout_feed', (data) => {
    console.log('🏋️‍♂️ Nytt träningspass/set:', data);
    io.emit('admin_workout_feed', data);
  });

  socket.on('admin_metric_feed', (data) => {
    console.log('📈 Nya mätvärden:', data);
    io.emit('admin_metric_feed', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Elevate körs på port ${PORT}`));
