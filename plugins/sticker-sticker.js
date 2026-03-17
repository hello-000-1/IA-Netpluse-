import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args }) => {
  let stiker = null
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp')
    if (/webp|image|video/g.test(mime)) {
      if (/video/.test(mime) && ((q.msg || q).seconds > 8)) {
        return m.reply('⚠️ *El video no puede durar más de 8 segundos.*')
      }
      const media = await q.download()
      if (!media) return m.reply('❌ *No se pudo descargar el archivo. Asegúrate de responder a una imagen/video o gif.*')
      const tmpPath = path.join('./tmp', `${Date.now()}.webp`)
      try {
        stiker = await sticker(
          media,
          false,
          global.packsticker || 'Black Clover Pack',
          global.author || 'By Elvis SF'
        )
        if (Buffer.isBuffer(stiker)) fs.writeFileSync(tmpPath, stiker)
      } catch (e) {
        let out
        if (/webp/.test(mime)) out = await webp2png(media)
        else if (/image/.test(mime)) out = await uploadImage(media)
        else if (/video/.test(mime)) out = await uploadFile(media)
        if (typeof out !== 'string') out = await uploadImage(media)
        stiker = await sticker(
          false,
          out,
          global.packsticker || 'Black Clover Pack',
          global.author || 'By Elvis SF'
        )
        if (Buffer.isBuffer(stiker)) fs.writeFileSync(tmpPath, stiker)
      }
    } else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(
          false,
          args[0],
          global.packsticker || 'Black Clover Pack',
          global.author || 'By Elvis SF'
        )
        const tmpPath = path.join('./tmp', `${Date.now()}.webp`)
        if (Buffer.isBuffer(stiker)) fs.writeFileSync(tmpPath, stiker)
      } else {
        return m.reply('📛 *El enlace proporcionado no es válido.*')
      }
    } else {
      return m.reply('📌 *Envía o responde a una imagen/video/gif (máx 8s) o proporciona un enlace válido.*')
    }
  } catch (e) {
    console.error('❌ Error al crear el sticker:', e)
    return m.reply('⚠️ *Ocurrió un error inesperado al intentar crear el sticker.*')
  }
  if (stiker) {
    try {
      const imgFolder = path.join('./src/img')
      const imgFiles = fs.existsSync(imgFolder) ? fs.readdirSync(imgFolder).filter(f => /\.(jpe?g|png|webp)$/i.test(f)) : []
      let contextInfo = {}
      if (imgFiles.length > 0) {
        const randomImg = path.join(imgFolder, imgFiles[Math.floor(Math.random() * imgFiles.length)])
        const thumb = fs.existsSync(randomImg) ? fs.readFileSync(randomImg) : null
        if (thumb) {
          contextInfo = {
            externalAdReply: {
              title: 'IA-Netpluse 🥷🏻',
              body: 'Dev • Elvis SF ✨',
              mediaType: 2,
              thumbnail: thumb
            }
          }
        }
      }
      if (Buffer.isBuffer(stiker)) {
        await conn.sendMessage(
          m.chat,
          { sticker: stiker, contextInfo },
          { quoted: m }
        )
      } else if (typeof stiker === 'string') {
        await conn.sendMessage(
          m.chat,
          { sticker: { url: stiker }, contextInfo },
          { quoted: m }
        )
      } else {
        throw new Error('Formato de sticker no válido')
      }
    } catch (e) {
      console.error('⚠️ Error al enviar el sticker:', e)
      return m.reply('❌ *No se pudo enviar el sticker. Intenta con otro archivo.*')
    }
  } else {
    return m.reply('❌ *No se pudo crear el sticker. Intenta con otro archivo o revisa que el formato sea válido.*')
  }
}

handler.help = ['sticker', 'stiker', 's'].map(v => v + ' <imagen|video|url>')
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']
handler.group = false
handler.register = true

export default handler

function isUrl(text) {
  return /^https?:\/\/.*\.(jpe?g|gif|png|webp)$/i.test(text)
}