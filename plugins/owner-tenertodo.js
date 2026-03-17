const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]

  if (!user) return conn.reply(m.chat, '❌ No se encontró tu perfil en la base de datos.', m)
  if (!Array.isArray(user.personajes)) user.personajes = []

  // 🎴 Definición de todos los personajes (TOP + comunes)
  const personajesTop = [
    { nombre: 'Cristo rey 👑' },
    { nombre: 'Arcangel Supremo 😇' },
    { nombre: 'Elvis SF 🧠' },
    { nombre: 'Dios del Tiempo ⏳' },
    { nombre: 'Dragón Ancestral 🐉' },
    { nombre: 'Samurai de la Sombra ⚔️' },
    { nombre: 'Dios Guerrero 🪖' },
    { nombre: 'Hechicero Supremo 🧙‍♂️' },
    { nombre: 'Titán del Infinito 👹' },
    { nombre: 'Alma del Vacío 👻' }
  ]

  const nombresComunes = [
    'Goku','Naruto','Sasuke','Luffy','Zoro','Sanji','Sakura','Hinata','Tanjiro','Nezuko',
    'Levi','Eren','Itachi','Madara','Kakashi','Ichigo','Rukia','Byakuya','Saitama','Genos',
    'Batman','Superman','Iron Man','Spider-Man','Thanos','Deadpool','Shrek','Donkey',
    'Elsa','Anna','Simba','Scar','Woody','Buzz','Pikachu','Kirby','Link','Zelda','Ash',
    'Charizard','Mewtwo','Deku','Bakugo','Todoroki','All Might','Gojo','Sukuna','Yuji',
    'Megumi','Nobara','Asta','Yuno','Noelle','Yami','Rem','Emilia','Subaru','Inuyasha',
    'Sesshomaru','Sango','Kagome','Kirito','Asuna','Sinon','Leafa','Jotaro','Dio','Josuke',
    'Joseph','Polnareff','Shinobu','Rengoku','Giyu','Akaza','Muzan','Eula','Diluc','Klee',
    'Zhongli','Venti','Raiden','Nahida','Albedo','Kazuha','Itto','Xiao','Yoimiya','Ayaka',
    'Tartaglia','Scaramouche','Furina','Clorinde','Freminet','Cyno','Nilou','Baizhu',
    'Alhaitham','Lynette','Lyney','Cheems'
  ]

  const personajesComunes = nombresComunes.map(nombre => ({ nombre }))
  const todos = [...personajesTop, ...personajesComunes]

  // 🧩 Asignar personajes si no los tiene aún
  let nuevos = 0
  for (let p of todos) {
    if (!user.personajes.includes(p.nombre)) {
      user.personajes.push(p.nombre)
      nuevos++
    }
  }

  if (nuevos === 0) {
    return conn.reply(m.chat, '✅ Ya tienes todos los personajes del sistema.', m)
  }

  conn.reply(m.chat, `🎉 Se han añadido *${nuevos}* personajes a tu colección.\n🎴 Ahora tienes un acceso completo como Owner.`, m)
}

handler.help = ['tenertodo']
handler.tags = ['rpg']
handler.command = ['tenertodo']
handler.rowner = true // Solo owners pueden usarlo
export default handler