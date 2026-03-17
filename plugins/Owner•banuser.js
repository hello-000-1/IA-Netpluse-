let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('⚠️ *Ingresa el @tag de algún usuario.*')

    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) return m.reply('⚠️ *Ingresa el @tag de algún usuario.*')

    let users = global.db.data.users
    if (!users[who]) users[who] = {}

    users[who].banned = true

    await conn.sendMessage(
        m.chat,
        {
            text: `⚠️ *El usuario @${who.split('@')[0]} fue baneado con éxito.*`,
            contextInfo: {
                forwardingScore: 200,
                isForwarded: false,
                mentionedJid: [who],
                externalAdReply: {
                    showAdAttribution: false,
                    title: `𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ☘︎`,
                    body: `✡︎ Dev • Elvis SF`,
                    mediaType: 2,
                    sourceUrl: global.redes || '',
                    thumbnail: global.icons || null
                }
            }
        },
        { quoted: m }
    )
}

handler.help = ['banuser <@tag>']
handler.command = ['banuser']
handler.tags = ['owner']
handler.rowner = true

export default handler