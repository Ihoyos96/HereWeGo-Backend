const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const os = require('os');

function getServerIPAddress() {
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
        for (let alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
    const ip = getServerIPAddress();
    console.log(`Server listening on http://${ip}:3000`);
});
