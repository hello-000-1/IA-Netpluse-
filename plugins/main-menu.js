import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const charset = { a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ' }
const textCyberpunk = t => t.toLowerCase().replace(/[a-z]/g, c => charset[c])

const tags = {
  main: textCyberpunk('sistema'),
  group: textCyberpunk('grupos'),
  serbot: textCyberpunk('sub bots')
}

const defaultMenu = {
  before: `
—͟͟͞͞   *REGISTRO NETPLUSE* »
> 🏷 𝙽𝚘𝚖𝚋𝚛𝚎   » %name
> 📉 𝙽𝚒𝚟𝚎𝚕     » %level
> ⚡ 𝙴𝚡𝚙        » %exp / %maxexp
> 🌐 Estado      » %mode
> ⏱️ 𝙰𝚌𝚝𝚒𝚟𝚒𝚍𝚊𝚍   » %muptime
> 👥 𝚄𝚜𝚞𝚊𝚛𝚒𝚘𝚜 » %totalreg

🤖 » ＭＥＮＵ ＤＥ ＯＰＣＩＯＮＥＳ IA-NETPLUSE «
👑 » 𝗢𝗽𝗲𝗿𝗮𝗱𝗼𝗿:—͟͟͞͞ 𝗘𝗹𝘃𝗶𝘀 𝗦𝗙 🧾 «
%readmore
`.trimStart(),
  header: '\n⧼⋆꙳•〔 📃 %category 〕⋆꙳•⧽',
  body: '> 🔖 %cmd',
  footer: '➥⌥⊶⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋯⋯⋯⋅⋅⋅⋯⌱',
  after: '\n⌬ 𝗖𝗬𝗕𝗘𝗥 𝗠𝗘𝗡𝗨 🧬 - Sistema ejecutado con éxito.'
}

const menuDir = './media/menu'
fs.mkdirSync(menuDir, { recursive: true })

const getMenuMediaFile = jid =>
  path.join(menuDir, `menuMedia_${jid.replace(/[:@.]/g, '_')}.json`)

const loadMenuMedia = jid => {
  const file = getMenuMediaFile(jid)
  if (!fs.existsSync(file)) return {}
  try { return JSON.parse(fs.readFileSync(file)) } catch { return {} }
}

const fetchBuffer = async url =>
  Buffer.from(await (await fetch(url)).arrayBuffer())

const defaultThumb = await fetchBuffer('https://files.catbox.moe/tpufpt.jpg')
const defaultVideo = await fetchBuffer('https://files.catbox.moe/nge7n4.mp4')

let handler = async (m, { conn, usedPrefix }) => {
  await conn.sendMessage(m.chat, { react: { text: '⚔️', key: m.key } })

  const botJid = conn.user.jid
  const menuMedia = loadMenuMedia(botJid)
  const menu = global.subBotMenus?.[botJid] || defaultMenu

  const user = global.db.data.users[m.sender] || { level: 0, exp: 0 }
  const { min, xp } = xpRange(user.level, global.multiplier)

  const replace = {
    name: await conn.getName(m.sender),
    level: user.level,
    exp: user.exp - min,
    maxexp: xp,
    totalreg: Object.keys(global.db.data.users).length,
    mode: global.opts.self ? 'Privado' : 'Público',
    muptime: clockString(process.uptime() * 1000),
    readmore: String.fromCharCode(8206).repeat(4001)
  }

  const help = Object.values(global.plugins || {})
    .filter(p => !p.disabled)
    .map(p => ({
      help: [].concat(p.help || []),
      tags: [].concat(p.tags || []),
      prefix: 'customPrefix' in p
    }))

  for (const { tags: tg } of help)
    for (const t of tg)
      if (t && !tags[t]) tags[t] = textCyberpunk(t)

  const text = [
    menu.before,
    ...Object.keys(tags).map(tag => {
      const cmds = help
        .filter(p => p.tags.includes(tag))
        .flatMap(p => p.help.map(c =>
          menu.body.replace('%cmd', p.prefix ? c : usedPrefix + c)
        )).join('\n')
      return `${menu.header.replace('%category', tags[tag])}\n${cmds}\n${menu.footer}`
    }),
    menu.after
  ].join('\n').replace(/%(\w+)/g, (_, k) => replace[k] ?? '')

  const thumb = menuMedia.thumbnail && fs.existsSync(menuMedia.thumbnail)
    ? fs.readFileSync(menuMedia.thumbnail)
    : defaultThumb

  const video = menuMedia.video && fs.existsSync(menuMedia.video)
    ? fs.readFileSync(menuMedia.video)
    : defaultVideo

  const uniqueThumb = Buffer.concat([thumb, Buffer.from(botJid)])

  await conn.sendMessage(m.chat, {
    video,
    gifPlayback: true,
    jpegThumbnail: uniqueThumb,
    caption: text,
    footer: '🧠 Netpluse SYSTEM ☘️',
    buttons: [
      { buttonId: `${usedPrefix}menurpg`, buttonText: { displayText: '🏛️ M E N U R P G' }, type: 1 },
      { buttonId: `${usedPrefix}creador`, buttonText: { displayText: '👑 C R E A D O R 🥷'}, type: 1 },
      { buttonId: `${usedPrefix}code`, buttonText: { displayText: '🕹 ＳＥＲＢＯＴ' }, type: 1 }
    ],
    contextInfo: {
      externalAdReply: {
        title: menuMedia.menuTitle || '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 | SF',
        body: 'ִ┊̻̳̳࣪͋͋͋͋͋̓͋͋͋̓̓͋͋͌̈́𖡹⃞⃣ • 𝗘𝗹𝘃𝗶𝘀 𝗦𝗙 ♱',
        thumbnail: uniqueThumb,
        sourceUrl: 'https://github.com/hello-000-1/IA-Netpluse-',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['menulist', 'menúlist']
handler.tags = ['main']
handler.command = ['menulist', 'menú', 'help', 'ayuda']
handler.register = true
export default handler

const clockString = ms =>
  [3600000, 60000, 1000].map((v, i) =>
    String(Math.floor(ms / v) % (i ? 60 : 99)).padStart(2, '0')
  ).join(':')