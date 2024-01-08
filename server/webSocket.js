const WebSocket = require('ws');

let wss = null;

module.exports = {
  init: (server) => {
    wss = new WebSocket.Server({ server });
    // Set up wss event handlers
    wss.on('connection', (ws) => {
      console.log('Client connected');

      ws.on('message', (message) => {
        console.log('Received:', message);
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  },
  getWss: () => {

    if (!wss) {
      throw new Error("WebSocket Server not initialized");
    }
    return wss;
  }
};
