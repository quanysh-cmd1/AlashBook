export default async function handler(req: any, res: any) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "8686287349:AAGEa_qfVUeUYII1YKDIqb_-apEGm78xGec";

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

  if (req.method === 'POST') {
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
    return res.status(200).send('OK');
  }

  return res.status(405).send('Method Not Allowed');
}
