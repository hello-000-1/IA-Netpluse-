//código creado x Elvis SF 
//no olviden dejar créditos 
const IVA = 0.20
const owners = [...global.owner.map(([num]) => num + '@s.whatsapp.net')]

let handler = async (m, { conn, text }) => {
  if (typeof m.text !== "string") m.text = ""

  const senderJid = m.sender

  if (!global.db.data.users[senderJid]) global.db.data.users[senderJid] = {}
  const sender = global.db.data.users[senderJid]
  sender.monedas = sender.monedas || 0

  let who = m.mentionedJid?.[0]
  if (!who) throw '🚨 *MENCIONA A UN USUARIO*\n📌 Usa: *@usuario cantidad*'

  if (!global.db.data.users[who]) global.db.data.users[who] = {}
  const receiver = global.db.data.users[who]
  receiver.monedas = receiver.monedas || 0

  let cantidadTexto = text.replace('@' + who.split('@')[0], '').trim()
  if (!cantidadTexto) throw '💰 *Debes indicar la cantidad a transferir*'
  if (isNaN(cantidadTexto)) throw '❌ *Solo se permiten números*'

  const monto = parseInt(cantidadTexto)
  if (monto <= 0) throw '⚠️ *La cantidad debe ser mayor que 0*'

  const impuesto = Math.ceil(monto * IVA)
  const total = monto + impuesto

  if (sender.monedas < total)
    throw `😵‍💫 *Fondos insuficientes*\n🪙 Tienes: ${sender.monedas.toLocaleString()}\n💸 Requieres: ${total.toLocaleString()} (incluye IVA)`

  sender.monedas -= total
  receiver.monedas += monto

  const impuestoPorOwner = Math.floor(impuesto / owners.length)
  owners.forEach(ownerJid => {
    if (!global.db.data.users[ownerJid]) global.db.data.users[ownerJid] = {}
    global.db.data.users[ownerJid].monedas = (global.db.data.users[ownerJid].monedas || 0) + impuestoPorOwner
  })

  await conn.reply(
    m.chat,
    `✅ *Transferencia Exitosa*  
👤 Enviaste *${monto.toLocaleString()}* monedas a @${who.split('@')[0]}  
🧾 *IVA (20%)*: *${impuesto.toLocaleString()}*  
📤 *Total descontado*: *${total.toLocaleString()}* monedas`,
    m,
    { mentions: [who] }
  )

  conn.fakeReply(
    m.chat,
    `📥 *Has recibido ${monto.toLocaleString()} monedas 🪙* de @${senderJid.split('@')[0]}!`,
    who,
    m.text
  )
}

handler.help = ['transferir *@usuario cantidad*']
handler.tags = ['economia', 'rpg']
handler.command = ['transferir', 'enviar', 'dar']
handler.register = true

export default handler