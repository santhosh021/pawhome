const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { UPLOAD_DIR } = require('./config/upload');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(bodyParser.json()); // JSON bodies (multipart is handled by Multer)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/uploads', express.static(UPLOAD_DIR));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
