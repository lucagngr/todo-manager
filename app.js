const mongoose = require('mongoose');
//connect on my account mongoDB
mongoose.connect('mongodb+srv://Lucagngr:Lucatest47!@cluster0.mongodb.net/<dbname>', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.log('Erreur de connexion à MongoDB:', err));

  //schema mongoose
  const taskSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    description: { type: String },            
    completed: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now } 
  });
  
  module.exports = mongoose.model('Task', taskSchema); 
//schema express
  app.post('/tasks', async (req, res) => {
    try {
      const { title, description } = req.body; 
      const newTask = new Task({ title, description }); 
      await newTask.save();
      res.status(201).json(newTask); 
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });