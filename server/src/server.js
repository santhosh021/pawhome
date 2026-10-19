require('dotenv').config();
const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');

const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;
if (!MONGO_URI || !JWT_SECRET) {
  console.error('MONGO_URI and JWT_SECRET must be set');
  process.exit(1);
}

(async () => {
  await connectDB(MONGO_URI);
  await seedAdmin();
  const app = require('./app');
  app.listen(PORT, () => console.log(`PawHome API listening on ${PORT}`));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
