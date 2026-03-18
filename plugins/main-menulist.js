const handler = async (m, { conn }) => {  

  const sections = [  
    {  
      title: '🎃 Menú list ♱',  
      rows: [  
        { title: '🕸️ Menu', id: '.menulist', description: 'Menu principal general del bot' },  
        { title: '💀 Code', id: '.code', description: 'Herramientas y sub-bots' },  
        { title: '🧛‍♂️ Menu RPG', id: '.menurpg', description: 'Juegos RPG y otros' },  
        { title: '👑 Øwner', id: '.owner', description: 'Menu del propietario del bot' },  
        { title: '📡 EStado', id: '.estado', description: 'Analisis del estado de conexión' },  
        { title: '🎵 Play', id: '.play', description: 'Descarga musicas de plataformas populares' },  
        { title: '⚙️ Enable', id: '.enable', description: 'Funciones especiales del bot ADMIN' },  
        { title: '💡 ON', id: '.on', description: 'Activa/Desactiva modos de actividad' }  
      ]  
    }  
  ]  

  const msg = {  
    viewOnceMessage: {  
      message: {  
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },  
        interactiveMessage: {  
          body: {   
            text: `*IA-NETPLUSE SF*

Bienvenido *,${m.pushName}* al sistema inteligente IA-NETPLUSE

/↪ 📥 Descarga contenido de múltiples plataformas
↪ 🎮 Disfruta de un sistema RPG interactivo
↪ 🤖 Utiliza funciones con Inteligencia Artificial
↪ 🔍 Realiza búsquedas rápidas y eficientes
↪ 🎬 Accede a entretenimiento y juegos
↪ ⚙️ Convierte y gestiona contenido multimedia
↪ 🛡️ Mantén el control con herramientas de moderación

Seleccione una opción para continuar:`   
          },  
          footer: { text: '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬 | EDICION- IA NETPLUSE' },  
          header: {  
            type: 'IMAGE',  
            imageUrl: 'https://i.imgur.com/3fJ1P1b.png',  
            title: ' Menu Principal Del bot'  
          },  
          nativeFlowMessage: {  
            buttons: [  
              {  
                name: 'single_select',  
                buttonParamsJson: JSON.stringify({  
                  title: '📂 Elige una opcion',  
                  sections  
                })  
              }  
            ]  
          }  
        }  
      }  
    }  
  }  

  await conn.relayMessage(m.chat, msg.viewOnceMessage.message, {})  
  m.react('✅')  
}  

handler.command = ['menu',]  
handler.tags = ['grupos']  
handler.group = true  

export default handler