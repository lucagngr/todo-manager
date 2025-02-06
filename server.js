const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const task = require('./model/task');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(express.json());

const messages = {
  fr: {
    morning: "Bonjour",
    lunch: "Bon appétit",
    afternoon: "Bonne après-midi",
    evening: "Bonne soirée",
    night: "Bonne nuit"
  },
  en: {
    morning: "Good morning",
    lunch: "Enjoy your meal",
    afternoon: "Good afternoon",
    evening: "Good evening",
    night: "Good night"
  }
};

// Function to address a message based on the time of day
function getMessageBasedOnTime(language) {
  const currentHour = new Date().getHours();
  const langMessages = messages[language] || messages.fr;

  if (currentHour >= 5 && currentHour < 12) {
    return langMessages.morning;
  } else if (currentHour >= 12 && currentHour < 13) {
    return langMessages.lunch;
  } else if (currentHour >= 13 && currentHour < 18) {
    return langMessages.afternoon;
  } else if (currentHour >= 18 && currentHour < 22) {
    return langMessages.evening;
  } else {
    return langMessages.night;
  }
}

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/json', (req, res) => {
  const language = req.query.lang || 'fr';
  const message = getMessageBasedOnTime(language);
  res.json({ message: message });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur de connexion à MongoDB:", err));

// Routes for tasks
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new task({ title, description });
    await newTask.save(); 
    res.status(201).json(newTask); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await task.find();
    res.json(tasks);  
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
});

// read task
app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete task 
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HTML and CSS rendering
app.get('/', (req, res) => {
  const language = req.query.lang || 'fr';
  const message = getMessageBasedOnTime(language);

  res.send(`
    <!DOCTYPE html>
    <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message du jour</title>
        <link rel="stylesheet" href="/styles/style.css">
      </head>
      <body>
        <h1>${message}</h1>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
