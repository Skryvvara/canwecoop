import { appendFileSync } from 'node:fs';

export function Log(type: 'error' | 'info', message: string) {
  let date = new Date().toJSON().slice(0, 10);
  let time = new Date(Date.now()).toLocaleString('de', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  message = (type == 'error') ? `[${time}][ERROR] ${message}\n` : `[${time}][INFO] ${message}\n`;
  (type == 'error') ? console.error(message) : console.info(message);
  appendFileSync(`./logs/${date}.txt`, message, );
}
