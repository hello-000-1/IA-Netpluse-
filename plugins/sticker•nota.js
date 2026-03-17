//código creado x Elvis SF 👑 
import Jimp from "jimp";
import { sticker } from '../lib/sticker.js';
import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("⚠️ Escribe algo después de .nota\nEjemplo: *.nota Hola*");

  let words = text.split(/\s+/).slice(0, 20);
  text = words.join(' ');

  let image = await Jimp.read("./src/sticker/nota.jpg");

  let fontSize = 200;
  let font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
  const maxWidth = image.bitmap.width - 60;
  const maxHeight = 500;

  while (Jimp.measureTextHeight(font, text, maxWidth) > maxHeight && fontSize > 64) {
    fontSize -= 16;
    font = await Jimp.loadFont(
      fontSize > 128 ? Jimp.FONT_SANS_128_BLACK :
      fontSize > 64 ? Jimp.FONT_SANS_64_BLACK :
      Jimp.FONT_SANS_32_BLACK
    );
  }

  const textHeight = Jimp.measureTextHeight(font, text, maxWidth);
  const y = (image.bitmap.height - textHeight) / 2;

  image.print(
    font,
    30,
    y,
    {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    },
    maxWidth,
    textHeight
  );

  let buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  let stiker = await sticker(buffer, false, '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞', 'Elvis SF 👑');

  if (!stiker) return m.reply("❌ No se pudo generar el sticker.");

  const imgFolder = path.join('./src/img');
  let imgFiles = [];
  if (fs.existsSync(imgFolder)) {
    imgFiles = fs.readdirSync(imgFolder).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  }
  let contextInfo = {};
  if (imgFiles.length > 0) {
    contextInfo = {
      externalAdReply: {
        title: '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 | nota 📝',
        body: 'Dev • Elvis SF 👑',
        mediaType: 2,
        thumbnail: fs.readFileSync(path.join(imgFolder, imgFiles[0]))
      }
    };
  }

  await conn.sendMessage(m.chat, { sticker: stiker, contextInfo }, { quoted: m });
};

handler.help = ['n', 'nota', 'Nota'];
handler.tags = ['sticker'];
handler.command = ['n', 'nota', 'Nota'];
handler.group = false;
handler.register = true;
export default handler;