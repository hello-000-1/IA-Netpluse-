import fs from "fs"
import path from "path"

let handler = async (m, { conn }) => {
  if (!global.owner.some(([number]) => number == m.sender.split('@')[0])) {
    return conn.reply(m.chat, '⚠️ Este comando solo puede usarlo el *Owner*.', m)
  }

  const baseDir = path.join(__dirname, 'central-netpluse', 'blackJadiBot')
  if (!fs.existsSync(baseDir)) {
    return conn.reply(m.chat, '📂 No se encontró la carpeta *blackJadiBot*.', m)
  }

  let deleted = []
  let skipped = []

  const folders = fs.readdirSync(baseDir)
  for (let folder of folders) {
    const fullPath = path.join(baseDir, folder)

    if (fs.statSync(fullPath).isDirectory()) {
      let stillActive = global.conns.some(sock => {
        let jid = sock.authState?.creds?.me?.jid || ""
        return jid.includes(folder)
      })

      if (!stillActive) {
        fs.rmSync(fullPath, { recursive: true, force: true })
        deleted.push(folder)
      } else {
        skipped.push(folder)
      }
    }
  }

  let msg = `🧹 *Limpieza de Sub-Bots*\n\n`
  msg += `✅ Eliminados: ${deleted.length ? deleted.join(', ') : 'Ninguno'}\n`
  msg += `⏳ Activos: ${skipped.length ? skipped.join(', ') : 'Ninguno'}`

  await conn.reply(m.chat, msg, m)
}

handler.help = ['clearsubs']
handler.tags = ['owner']
handler.command = ['clearsubs']
handler.rowner = true  

export default handler