const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

//Object containing the messages for each language
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

//Function to address a message based on the time of day
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

//schema for express and port
app.use(express.static(path.join(__dirname, '../public'))); 


app.get('/', (req, res) => {
  const language = req.query.lang || 'fr';
  const message = getMessageBasedOnTime(language);

  res.json({ message: message }); 
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});

//HTML CSS insertion
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
