async function init() {
  const db = require('./database/database-manager');
  db.init();
  while (!db.isDbLoaded()) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await require('./endpoints/endpoint-manager').init();
}

module.exports = { init };
