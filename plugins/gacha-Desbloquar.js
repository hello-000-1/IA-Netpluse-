//código creado x Elvis SF 👑 
let handler = async (m, { conn, args }) => {
    let users = global.db.data.users;
    let user = m.sender;
    let userData = users[user];

    if (!userData) userData = users[user] = { monedas: 0, antirobo: 0, desbloqueo: 0 };

    let target = m.mentionedJid[0] || args[0];
    if (!target) {
        return conn.reply(
            m.chat,
            `✘ Debes mencionar a alguien.\n\nEjemplo:\n*#desbloquear @usuario*`,
            m
        );
    }

    if (!(target in users)) {
        return conn.reply(m.chat, `✘ Usuario no encontrado en la base de datos.`, m);
    }

    let targetData = users[target];

    // sex 🥵
    if (!targetData) targetData = users[target] = { monedas: 0, antirobo: 0, desbloqueo: 0 };

    let costo = 100000; 
    let duracion = 3 * 60 * 1000; 

    // Elvis SF estubo aquí 
    if (userData.monedas < costo) {
        return conn.reply(
            m.chat,
            `✘ No tienes suficientes monedas.\n` +
            `Necesitas *${costo.toLocaleString()}* monedas para desbloquear la base de ${conn.getName(target)}.`,
            m
        );
    }

    userData.monedas -= costo;
    targetData.desbloqueo = Date.now() + duracion;
    targetData.antirobo = 0; 

    conn.reply(
        m.chat,
        `⚠️ *Base desbloqueada*.\n` +
        `🔓 ${conn.getName(target)} ahora está vulnerable por 3 minutos.\n` +
        `⏳ Podrás robar sus waifus hasta: *${new Date(targetData.desbloqueo).toLocaleString()}*`,
        m
    );
};

handler.help = ['desbloquear @usuario'];
handler.tags = ['gacha'];
handler.command = ['desbloquear'];

export default handler;