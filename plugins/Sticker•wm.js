import { addExif } from '../lib/sticker.js';

let handler = async (m, { conn, text }) => {
    if (!m.quoted) return m.reply('*⚠ Responde a un sticker!*');
    let stiker = false;

    try {
        await m.react('⏳');
        let [packname, ...authorParts] = text.split('|');
        let author = authorParts.join('|') || '';
        let mime = m.quoted.mimetype || '';

        if (!/webp/.test(mime)) return m.reply('⚠️ *Responde a un sticker*');

        const img = await m.quoted.download();
        if (!img) return m.reply('⚠ *No se pudo descargar el sticker!*');

        stiker = await addExif(img, packname || '', author);

        if (stiker) {
            await conn.sendMessage(
                m.chat,
                {
                    sticker: stiker,
                    contextInfo: {
                        forwardingScore: 200,
                        isForwarded: false,
                        externalAdReply: {
                            showAdAttribution: false,
                            title: `𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ☘︎`,
                            body: `✡︎ Sticker By • Elvis SF`,
                            mediaType: 2,
                            sourceUrl: global.redes || '',
                            thumbnail: global.icons || null
                        }
                    }
                },
                { quoted: m }
            );
            await m.react('✅');
        } else {
            throw new Error('⚠️ *La conversión falló.*');
        }
    } catch (e) {
        console.error(e);
        await m.react('❌');
        m.reply(e.message || e);
    }
};

handler.help = ['take <nombre>|<autor>'];
handler.tags = ['sticker'];
handler.command = ['take', 'robar', 'wm'];

export default handler;