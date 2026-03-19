import axios from 'axios'
import Jimp from 'jimp'

const name = "Descargas - IA NETPLUSE"

async function resizeImage(buffer, size = 300) {
  const img = await Jimp.read(buffer)
  return img.resize(size, size).getBufferAsync(Jimp.MIME_JPEG)
}

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) 
    return conn.reply(m.chat, `✧ *Hechizo incompleto*\nDebes escribir lo que deseas buscar.`, m)

  try {
    await m.react('👨🏻‍💻')

    const res = await getGoogleImageSearch(text)
    const urls = await res.getAll()

    if (urls.length < 2)
      return conn.reply(m.chat, '✧ No hay suficientes imágenes para invocar el grimorio.', m)

    const caption = `✧ *Resultado del hechizo visual*\n➤ *${text}*`

    for (let url of urls.slice(0, 10)) {
      await conn.sendMessage(
        m.chat,
        {
          image: { url },
          caption,
        },
        { quoted: m }
      )
    }

    await m.react('✔️')

  } catch (error) {
    await m.react('✖️')
    conn.reply(
      m.chat,
      `⚠︎ *fallas xd *\nAlgo salió mal.\nUsa *${usedPrefix}report* para informar.\n\n${error.message}`,
      m
    )
  }
}

handler.help = ['imagen']
handler.tags = ['descargas']
handler.command = ['imagen', 'image']

export default handler


function getGoogleImageSearch(query) {

  const apiDelirius = global?.APIs?.delirius?.url || 'https://delirius-api.vercel.app'
  const apiSiputzx = global?.APIs?.siputzx?.url || 'https://api.siputzx.my.id'

  const apis = [
    `${apiDelirius}/search/gimage?query=${encodeURIComponent(query)}`,
    `${apiSiputzx}/api/images?query=${encodeURIComponent(query)}`
  ]

  return {
    getAll: async () => {
      for (const url of apis) {
        try {
          const res = await axios.get(url)
          const data = res.data

          if (Array.isArray(data?.data)) {
            const urls = data.data
              .map(d => d.url)
              .filter(u => typeof u === 'string' && u.startsWith('http'))

            if (urls.length) return urls
          }
        } catch (e) {
        }
      }
      return []
    },

    getRandom: async function () {
      const all = await this.getAll()
      return all[Math.floor(Math.random() * all.length)] || null
    }
  }
}