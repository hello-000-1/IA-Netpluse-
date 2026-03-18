import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const startTime = Date.now()

    // 1. Limpiar carpeta tmp
    const tmpDir = path.join(process.cwd(), 'tmp')
    if (fs.existsSync(tmpDir)) {
      const files = fs.readdirSync(tmpDir)
      files.forEach(file => {
        try {
          fs.unlinkSync(path.join(tmpDir, file))
        } catch (e) {}
      })
    }

    // 2. Limpiar logs.txt
    const logsPath = path.join(process.cwd(), 'logs.txt')
    if (fs.existsSync(logsPath)) {
      try {
        fs.unlinkSync(logsPath)
      } catch (e) {}
    }

    // 4. Vaciar COMPLETAMENTE la base de datos (TODO EN UNO)
    global.db.data = {
      users: {},
      chats: {},
      stats: {},
      msgs: {},
      sticker: {},
      settings: {}
    }
    await global.db.write()

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)

    m.reply(`
╭─ *✅ LIMPIEZA COMPLETADA* ✅ ─╮
│
├ 🧹 Carpeta tmp: Limpiada
├ 📋 logs.txt: Eliminado
├ 🗑️ Base de datos: Vaciada
│
├ ⏱️ Tiempo: ${duration}s
│
╰─────────────────────────────╯
    `.trim())

  } catch (e) {
    m.reply(`❌ Error: ${e.message}`)
    console.error(e)
  }
}

handler.help = ['limpiar']
handler.command = /^(limpiar|cleanup|limpieza)$/i
handler.tags = ['owner']
handler.rowner = true

export default handler
