const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// creating the server
const app = express();

// connect to the DB
connectDB();

app.use(cors());

// ENABLE EXPRESS.JSON
app.use(express.json({ extended: true }));

// APP PORT
const port = process.env.port || 4000;

// IMPORT ROUTES
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));


// DEFINE PRINCIPAL PAGE
app.get('/', (req, res) => {
    res.send('Hello World')
});

app.listen(port, '0.0.0.0', () => {
    console.log(`THE SERVER IS ON IN PORT ${port}`);
});

