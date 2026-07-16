const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Content Broadcasting System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api', publicRoutes);

module.exports = app;
