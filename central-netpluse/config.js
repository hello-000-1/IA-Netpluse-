import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs'; 
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//*─✞─ CONFIGURACIÓN GLOBAL ─✞─*

// BETA: Número del bot
global.botNumber = ''; // Ejemplo: 525568138672
//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.owner = [
  ['51928567606', '🜲 𝗖𝗿𝗲𝗮𝗱𝗼𝗿 👻', true],
  [''],
  ['51928567606', 'Elvis', true],
  ['', '', false], // Espacios opcionales
  ['', '', false]
];
global.mods = ['5215544876071'];
global.suittag = ['5215544876071'];
global.prems = ['5215544876071'];

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.libreria = 'Baileys';
global.baileys = 'V 6.7.9';
global.languaje = 'Español';
global.vs = '2.2.0';
global.vsJB = '5.0';
global.nameqr = '𝗜𝗮𝗡𝗲𝘁𝗽𝗹𝘂𝘀𝗲';
global.sessions = 'blackSession';
global.jadi = 'blackJadiBot';
global.blackJadibts = true;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.packsticker = `
  𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ᚲ SF`;

global.packname = '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ☘';

global.author = `
♾━━━━━━━━━━━━━━━♾`;
//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.wm = '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ☘';
global.titulowm = '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ☘';
global.igfg = 'ᥫ𝗘𝗹𝘃𝗶𝘀 SF'
global.botname = '𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ☘'
global.dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ the Legends ⚡'
global.textbot = '����������  : 𝗘𝗹𝘃𝗶𝘀 SF'
global.gt = '͟͞𝐈𝐚𝐍𝐞𝐭𝐩𝐥𝐮𝐬𝐞 ☘͟͞';
global.namechannel = '���������� / 𝗘𝗹𝘃𝗶𝘀 SF'
// Moneda interna
global.monedas = 'monedas';

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
global.gp1 = 'https://chat.whatsapp.com/IbADO35sBSC4G1FBTGbHIE?mode=ac_t';
global.gp2 = 'https://chat.whatsapp.com/FiBcPMYEO7mG4m16gBbwpP?mode=ac_t';
global.comunidad1 = 'https://chat.whatsapp.com/FgQ4q11AjaO8ddyc1LvK4r?mode=ac_t';
global.channel = 'https://whatsapp.com/channel/0029VbB36XC8aKvQevh8Bp04';
global.cn = global.channel;
global.yt = 'https://www.youtube.com/@ElCarlos.87';
global.md = 'https://github.com/thecarlos19/black-clover-MD';
global.correo = 'thecarlospcok@gmail.com';

global.catalogo = fs.readFileSync(new URL('../src/catalogo.jpg', import.meta.url));
global.photoSity = [global.catalogo];

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

global.estilo = { 
  key: {  
    fromMe: false, 
    participant: '0@s.whatsapp.net', 
  }, 
  message: { 
    orderMessage: { 
      itemCount : -999999, 
      status: 1, 
      surface : 1, 
      message: global.packname, 
      orderTitle: 'Bang', 
      thumbnail: global.catalogo, 
      sellerJid: '0@s.whatsapp.net'
    }
  }
};

global.ch = { ch1: "120363419782804545@newsletter" };
global.rcanal = global.ch.ch1;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

global.cheerio = cheerio;
global.fs = fs;
global.fetch = fetch;
global.axios = axios;
global.moment = moment;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*

global.multiplier = 69;
global.maxwarn = 3;

//*─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─✞─ׄ─ׅ─ׄ─*
const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright('Update \'central-netpluse/config.js\''));
  import(`${file}?update=${Date.now()}`);
});
