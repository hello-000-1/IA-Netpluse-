//código creado x Elvis SF 👑
//no olvides dejar créditos 
let handler = async (m, { conn, args }) => {
  const user = global.db.data.users[m.sender]
  const ratio = 100000
  const monedasPorIntercambio = 50000
  const LIMITE_DIARIO = 3

  if (!user.expcambio) {
    user.expcambio = { hoy: 0, fecha: new Date().toDateString() }
  }

  if (user.expcambio.fecha !== new Date().toDateString()) {
    user.expcambio.hoy = 0
    user.expcambio.fecha = new Date().toDateString()
  }

  if (user.expcambio.hoy >= LIMITE_DIARIO) {
    return m.reply(`🚫 Has alcanzado el *límite de ${LIMITE_DIARIO} intercambios diarios*.\n📆 Intenta nuevamente mañana.`)
  }

  if (!args[0] || isNaN(args[0])) {
    return m.reply(`📌 Uso correcto: *.cambiarexp <cantidad de exp>*\n🎯 Ejemplo: *.cambiarexp 100000*`)
  }

  let cantidad = parseInt(args[0])
  if (cantidad <= 0) return m.reply('❌ La cantidad debe ser mayor a 0.')
  if (user.exp < cantidad) return m.reply(`❌ No tienes suficiente experiencia.\n📊 Exp actual: *${user.exp.toLocaleString()}*`)

  let veces = Math.floor(cantidad / ratio)
  if (veces === 0) return m.reply(`❌ Debes intercambiar al menos *${ratio.toLocaleString()}* de experiencia para recibir monedas.`)

  if (user.expcambio.hoy + veces > LIMITE_DIARIO) {
    let disponibles = LIMITE_DIARIO - user.expcambio.hoy
    return m.reply(`⚠️ Solo puedes hacer *${disponibles}* intercambio(s) más hoy.\nUsaste: *${user.expcambio.hoy}/${LIMITE_DIARIO}*`)
  }

  let expUsada = veces * ratio
  let monedasGanadas = veces * monedasPorIntercambio

  user.exp -= expUsada
  user.monedas = (user.monedas || 0) + monedasGanadas
  user.expcambio.hoy += veces

  m.reply(`〔 *🔄 INTERCAMBIO COMPLETADO* 〕
┃🧪 Exp usada: *${expUsada.toLocaleString()}*
┃🪙 Monedas obtenidas: *${monedasGanadas.toLocaleString()}*
┃📆 Intercambios usados hoy: *${user.expcambio.hoy}/${LIMITE_DIARIO}*
╰━━━━━━━━━━━━━━━━━━⬣`)
}

handler.help = ['cambiarexp <cantidad>']
handler.tags = ['rpg', 'econ']
handler.command = ['cambiarexp', 'expxmonedas']
handler.register = true
export default handler