import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const TELEGRAM_TOKEN = "8686287349:AAGEa_qfVUeUYII1YKDIqb_-apEGm78xGec";

async function sendMessage(chatId: number, text: string, reply_markup?: any) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text, reply_markup: reply_markup })
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware for the webhook
  app.use(express.json());

  // Telegram Webhook API Endpoint
  app.post("/api/webhook", async (req, res) => {
    const update = req.body;
    
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text === '/start') {
        const replyMarkup = {
          inline_keyboard: [[{ text: "Ресми парақша", url: "https://t.me/alashbook" }]]
        };
        await sendMessage(
          chatId, 
          "Alash. қолданбасына тіркелгеніңізге рақмет!\nТөмендегі Alash. қолданбасының ресми телеграм парақшасына тіркеліп алыңыз алда болатын көптеген жаңалықтардан құр қалмас үшін",
          replyMarkup
        );
      } else {
        await sendMessage(chatId, "Кешіріңіз, мен тек /start командасын түсінемін.");
      }
    }
    
    // Always respond with 200 OK so Telegram knows we received it
    res.sendStatus(200);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
