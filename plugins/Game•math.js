//código creado x Elvis SF 👑 
global.math = global.math || {};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const textoAyuda = `
🌵 Ingrese la dificultad con la que deseas jugar

🚩 Dificultades disponibles: *${Object.keys(modes).join(' | ')}*
• Ejemplo: *${usedPrefix + command} noob*
`.trim();

  if (args.length < 1) return await conn.reply(m.chat, textoAyuda, m, rcanal);

  const mode = args[0].toLowerCase();
  if (!(mode in modes)) return await conn.reply(m.chat, textoAyuda, m, rcanal);

  const id = m.chat;
  if (id in global.math) 
    return conn.reply(m.chat, '🌵 Todavía hay una pregunta activa en este chat.', global.math[id][0]);

  const math = genMath(mode);
  
  // Inicializar usuario si no existe
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { monedas: 0 };
  const user = global.db.data.users[m.sender];

  if (!isNumber(user.monedas)) user.monedas = 0;

  // Guardar la pregunta en el objeto global
  global.math[id] = [
    await conn.reply(
      m.chat,
      `🧮 ¿Cuánto es el resultado de: *${math.str}*?\n\n🕝 Tiempo: *${(math.time / 1000).toFixed(2)} segundos*\n💰 Premio: *${math.bonus.toLocaleString()} Monedas*`,
      m,
      rcanal
    ),
    math,
    4, // Intentos
    setTimeout(() => {
      if (global.math[id]) {
        conn.reply(m.chat, `⏳ Se ha acabado el tiempo.\n\n✔️ La respuesta era: *${math.result}*`, m, rcanal);
        delete global.math[id];
      }
    }, math.time)
  ];
};

handler.before = async function (m, { conn }) {
  const id = m.chat;
  if (!(id in global.math)) return;

  const [msg, math, tries] = global.math[id];

  // Inicializar usuario si no existe
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { monedas: 0 };
  const user = global.db.data.users[m.sender];

  if (!isNumber(user.monedas)) user.monedas = 0;

  if (m.text && (parseInt(m.text) === math.result || parseFloat(m.text) === math.result)) {
    user.monedas = (user.monedas || 0) + math.bonus;

    conn.reply(m.chat, `🎉 ¡Correcto! Has ganado *${math.bonus.toLocaleString()}* monedas. 💰`, m, rcanal);

    clearTimeout(global.math[id][3]);
    delete global.math[id];
  } else if (tries > 1) {
    // Resta intentos si la respuesta es incorrecta
    global.math[id][2]--;
    conn.reply(m.chat, `❌ Respuesta incorrecta.\n🔁 Intentos restantes: *${global.math[id][2]}*`, m, rcanal);
  } else {
    // Se acabaron los intentos
    conn.reply(m.chat, `⏳ Se acabaron tus intentos.\n✔️ La respuesta correcta era: *${math.result}*`, m, rcanal);
    clearTimeout(global.math[id][3]);
    delete global.math[id];
  }
};

handler.help = ['math'];
handler.tags = ['fun'];
handler.command = ['math', 'mates', 'matemáticas'];
export default handler;

const modes = {
  noob: [-3, 3, -3, 3, '+-', 15000, 2000],
  easy: [-10, 10, -10, 10, '*/+-', 20000, 50000],
  medium: [-50, 50, -50, 50, '*/+-^%√', 30000, 100000],
  hard: [-100, 100, -100, 100, '*/+-^%√∛', 45000, 150000],
  extreme: [-1000, 1000, -1000, 1000, '*/+-^%√∛log', 60000, 180000],
  insane: [-5000, 5000, -5000, 5000, '*/+-^%√∛log!', 90000, 200000],
  genius: [-10000, 10000, -10000, 10000, '*/+-^%√∛log!', 120000, 220000],
  ultra: [-50000, 50000, -50000, 50000, '*/+-^%√∛log!^^', 150000, 250000],
  impossible: [-999999, 999999, -999999, 999999, '*/+-^%√∛log!^^', 180000, 270000],
  god: [-9999999, 9999999, -9999999, 9999999, '*/+-^%√∛log!^^', 240000, 280000],
  omega: [-99999999, 99999999, -99999999, 99999999, '*/+-^%√∛log!^^C', 300000, 100000], // ajustado
  infinity: [-999999999, 999999999, -999999999, 999999999, '*/+-^%√∛log!^^C', 400000, 300000], // ajustado
};

const operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
  '^': '^',
  '%': '%',
  '√': '√',
  '∛': '∛',
  '!': '!',
  'log': 'log',
  '^^': '^^',
  'C': 'C',
};

function genMath(mode) {
  const [a1, a2, b1, b2, ops, time, bonus] = modes[mode];
  let a = randomInt(a1, a2);
  let b = randomInt(b1, b2);
  const op = pickRandom([...ops]);
  let result;

  if (op === '^' || op === '^^') {
    b = Math.max(2, Math.min(op === '^^' ? 6 : 4, b));
    result = Math.pow(a, b);
  } else if (op === '%') {
    b = b === 0 ? 1 : b;
    result = a % b;
  } else if (op === '√') {
    a = Math.abs(a);
    result = Math.floor(Math.sqrt(a));
  } else if (op === '∛') {
    a = Math.abs(a);
    result = Math.floor(Math.cbrt(a));
  } else if (op === 'log') {
    a = Math.abs(a) + 1;
    result = Math.floor(Math.log10(a));
  } else if (op === '!') {
    a = Math.abs(a % 10);
    result = factorial(a);
  } else if (op === 'C') {
    a = Math.abs(a % 15) + 1;
    b = Math.min(Math.abs(b % a), a);
    result = combinatoria(a, b);
  } else if (op === '/') {
    b = b === 0 ? 1 : b;
    result = (a * b) / b;
  } else if (op === '*') {
    result = a * b;
  } else if (op === '+') {
    result = a + b;
  } else if (op === '-') {
    result = a - b;
  }

  return { str: `${a} ${operators[op]} ${b}`, mode, time, bonus, result };
}

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from];
  return Math.floor((to - from) * Math.random() + from);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function combinatoria(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function isNumber(x) {
  return typeof x === 'number' && !isNaN(x);
}