const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const imageRoutes = require('./routes/imageRoutes');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use('/api/images', upload.single('file'), imageRoutes);
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('Webhook received');
});



const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
.catch(err => console.error(`Error connecting to MongoDB: ${err.message}`));
