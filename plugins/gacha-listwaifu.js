//Código creado x Elvis SF 👑 
import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';

async function loadCharacters() {
    const data = await fs.readFile(charactersFilePath, 'utf-8');
    return JSON.parse(data);
}

let handler = async (m, { conn }) => {
    try {
        const characters = await loadCharacters();

        if (characters.length === 0) {
            return await conn.reply(m.chat, '✘ No hay waifus registradas.', m);
        }

        let listMessage = '✧ Lista de Waifus ✧\n\n';
        characters.forEach(c => {
            listMessage += `• Nombre: ${c.name}\n• ID: ${c.id}\n• Dueño: ${c.user ? c.user.split('@')[0] : 'Nadie'}\n\n`;
        });

        await conn.reply(m.chat, listMessage.trim(), m);
    } catch (error) {
        await conn.reply(m.chat, `✘ Error: ${error.message}`, m);
    }
};

handler.help = ['listawaifus'];
handler.tags = ['gacha'];
handler.command = ['listawaifus'];
handler.group = true;

export default handler;