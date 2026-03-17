function precioAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 🥇 TOP 10 PERSONAJES ÉPICOS
const personajesTop = [
  { nombre: 'Cristo rey 👑', precio: 20000000, habilidad: '✝️ Resurrección divina y control de todo el universo. Es el personaje más caro de todos.' },
  { nombre: 'Arcangel Supremo 😇', precio: precioAleatorio(5000000, 9999999), habilidad: '🛡 Protección celestial y fuego purificador.' },
  { nombre: 'Elvis SF 🧠', precio: precioAleatorio(5000000, 9999999), habilidad: '💻 Maestro del código y hacker de grimorios.' },
  { nombre: 'Dios del Tiempo ⏳', precio: precioAleatorio(5000000, 9999999), habilidad: '🌀 Controla el tiempo y revierte el destino.' },
  { nombre: 'Dragón Ancestral 🐉', precio: precioAleatorio(5000000, 9999999), habilidad: '🔥 Fuego que consume realidades enteras.' },
  { nombre: 'Samurai de la Sombra ⚔️', precio: precioAleatorio(5000000, 9999999), habilidad: '🌑 Técnica prohibida bajo luna sangrienta.' },
  { nombre: 'Dios Guerrero 🪖', precio: precioAleatorio(5000000, 9999999), habilidad: '🩸 Sed de batalla infinita y poder berserker.' },
  { nombre: 'Hechicero Supremo 🧙‍♂️', precio: precioAleatorio(5000000, 9999999), habilidad: '🔮 Domina el espacio y la magia del caos.' },
  { nombre: 'Titán del Infinito 👹', precio: precioAleatorio(5000000, 9999999), habilidad: '🏔 Destruye mundos de un solo golpe.' },
  { nombre: 'Alma del Vacío 👻', precio: precioAleatorio(5000000, 9999999), habilidad: '🌫 Intangibilidad total y grito cósmico.' }
]

// 🎭 LISTA DE 100 PERSONAJES COMUNES
const nombresComunes = [
  'Goku', 'Naruto', 'Sasuke', 'Luffy', 'Zoro', 'Sanji', 'Sakura', 'Hinata',
  'Tanjiro', 'Nezuko', 'Levi', 'Eren', 'Itachi', 'Madara', 'Kakashi',
  'Ichigo', 'Rukia', 'Byakuya', 'Saitama', 'Genos', 'Batman', 'Superman',
  'Iron Man', 'Spider-Man', 'Thanos', 'Deadpool', 'Shrek', 'Donkey', 'Elsa',
  'Anna', 'Simba', 'Scar', 'Woody', 'Buzz', 'Pikachu', 'Kirby', 'Link',
  'Zelda', 'Ash', 'Charizard', 'Mewtwo', 'Deku', 'Bakugo', 'Todoroki', 'All Might',
  'Gojo', 'Sukuna', 'Yuji', 'Megumi', 'Nobara', 'Asta', 'Yuno', 'Noelle', 'Yami',
  'Rem', 'Emilia', 'Subaru', 'Inuyasha', 'Sesshomaru', 'Sango', 'Kagome', 'Kirito',
  'Asuna', 'Sinon', 'Leafa', 'Jotaro', 'Dio', 'Josuke', 'Joseph', 'Polnareff',
  'Shinobu', 'Rengoku', 'Giyu', 'Akaza', 'Muzan', 'Eula', 'Diluc',
  'Klee', 'Zhongli', 'Venti', 'Raiden', 'Nahida', 'Albedo', 'Kazuha', 'Itto',
  'Xiao', 'Yoimiya', 'Ayaka', 'Tartaglia', 'Scaramouche', 'Furina', 'Clorinde',
  'Freminet', 'Cyno', 'Nilou', 'Baizhu', 'Alhaitham', 'Lynette', 'Lyney', 'Cheems'
].slice(0, 100) // Se asegura que solo haya 100

const personajesComunes = nombresComunes.map(nombre => ({
  nombre,
  precio: precioAleatorio(20000, 100000)
}))

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  if (!user.personajes) user.personajes = []

  const yaTiene = (nombre) => user.personajes.includes(nombre.toLowerCase()) ? '✅' : ''

  const topTexto = personajesTop.map(p => 
`\`\`\`
🎖️ ${p.nombre} ${yaTiene(p.nombre)}
💰 ${p.precio.toLocaleString()} monedas
🧠 ${p.habilidad}
\`\`\``).join('\n')

  const comunesAgrupados = {
    '💎 Elite (80k - 100k)': [],
    '⚔️ Rango Medio (50k - 79k)': [],
    '🌱 Básico (20k - 49k)': []
  }

  for (const p of personajesComunes) {
    const tiene = yaTiene(p.nombre)
    const linea = `• ${p.nombre} ${tiene} — 💰 ${p.precio.toLocaleString()} monedas`

    if (p.precio >= 80000) comunesAgrupados['💎 Elite (80k - 100k)'].push(linea)
    else if (p.precio >= 50000) comunesAgrupados['⚔️ Rango Medio (50k - 79k)'].push(linea)
    else comunesAgrupados['🌱 Básico (20k - 49k)'].push(linea)
  }

  let comunesTexto = ''
  for (const [rango, lista] of Object.entries(comunesAgrupados)) {
    comunesTexto += `\n🌀 *${rango}*\n` + lista.join('\n') + '\n'
  }

  const texto = `
🛡️ ℙ𝔼ℝ𝕊𝕆ℕ𝔸𝕁𝔼𝕊 🧬

👑 *TOP PERSONAJES ÉPICOS* 👑
${topTexto}

🎭 *PERSONAJES COMUNES DISPONIBLES* 📜
${comunesTexto}

📌 Usa: *.comprar <nombre del personaje>*
`.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['listarpersonajes']
handler.tags = ['rpg', 'economia']
handler.command = ['listarpersonajes', 'personajes', 'pjs', 'chars']
handler.register = true
export default handler