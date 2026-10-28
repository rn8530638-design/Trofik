// PM2 на VPS. Секреты читаются из /etc/trofik/trofik.env — он лежит только на сервере.
const fs = require('node:fs');

const envFile = '/etc/trofik/trofik.env';
const env = { NODE_ENV: 'production' };
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2];
  }
}

module.exports = {
  apps: [{
    name: 'trofik',
    cwd: '/var/www/trofik',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -H 127.0.0.1 -p 3000',
    env,
    max_memory_restart: '600M',
  }],
};
