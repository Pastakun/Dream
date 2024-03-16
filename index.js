import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const chatdata = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/getchat', (req, res) => {
  res.send(chatdata);
});

wss.on('connection', (ws) => {
  console.log('WebSocket connected');

  ws.on('message', (message) => {
    const json = JSON.parse(message);
    chatdata.push(json);
    if (chatdata.length > 200) {
      chatdata.shift();
    }

    wss.clients.forEach((client) => {
      console.log('test');
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(JSON.stringify(json));
      }
    });
  });
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
