import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const html = await readFile(resolve('public/index.html'), 'utf8');
const required = ['23.194.000', '11.597.000', '6.958.200', '4.638.800', '6 semanas', '3 horas', 'Consola docente', 'Agente interno de IA'];
const missing = required.filter((item) => !html.includes(item));
if (missing.length) throw new Error(`Falta contenido requerido: ${missing.join(', ')}`);
console.log('check OK · valores, alcance, cronograma y capacitación presentes');
