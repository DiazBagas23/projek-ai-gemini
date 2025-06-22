import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, ReplayResponse } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT  || 3000;

const STATIC_PATH = 'public';
// Middleware setup

app.use(cors());
app.use(express.json());
//r root route for serving static files
app.use(express.static(STATIC_PATH));

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  //validasi usermessege
    if (!message) {
        return res.status(400).json({ reply: 'Pesan Tidak boleh kosong' });
    }

try {
    // Validasi pesan terakhir
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message });
    //   config:{ systemInstruction: 'Anda adalah asisten AI yang membantu pengguna dengan pertanyaan mereka. Berikan jawaban yang jelas dan informatif.'

    // //Handle Status pesan
    //    }
     
      const text = result.text;
      return res.status(200).json({ reply: text });
} catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }

});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
