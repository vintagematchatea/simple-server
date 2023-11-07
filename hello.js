// Load HTTP module
// const http = require("http");

// load net module
var net = require('net');

// const hostname = "127.0.0.1";
// const port = 8000;

// Create HTTP server
// const server = http.createServer(function (req, res) {
//   // Set the response HTTP header with HTTP status and Content type
//   res.writeHead(200, { "Content-Type": "text/plain" });

//   // Send the response body "Hello World"
//   res.end("Hello World\n");
// });

// Prints a log once the server starts listening
// server.listen(port, hostname, function () {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const port = 7070;
const host = '127.0.0.1';

const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port +'.');
});

let sockets = [];
let usernames = [];

// RUN telnet 127.0.0.1 7070
server.on('connection', function(sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);

    let name = '';
    sock.write('Welcome to my chat server! What is your nickname?\n');

    sock.on('data', function(data) {
      while (name === '') {
        if (usernames.length === 0 || usernames.indexOf(data) === -1) {
          name = data;
          usernames.push(name);
          sock.write('Your name is unique!\n');
          if (usernames.length > 1) {
            sock.write(`You are connected with ${usernames.length} other user: ${usernames.toString()}`);
          }
          sock.write('Start writing!\n');
        } else {
          sock.write('Try again!\n');
        }
      }
      
      console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function(sockClient, index, array) {
          console.log({ sock: sock.remotePort, sockClient: sockClient.remotePort });
          if (sock.remotePort !== sockClient.remotePort) {
            sockClient.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
          }
        });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
      let index = sockets.findIndex(function(o) {
          return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
      })
      if (index !== -1) sockets.splice(index, 1);
      console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
  });
});
