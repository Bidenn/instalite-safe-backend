const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path'); 
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const homepageRoutes = require('./routes/homepageRoutes');

app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/home', homepageRoutes);

app.use(express.static(path.join(__dirname, 'uploads')));

sequelize.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch((error) => console.error('Authentication failed:', error));

// sequelize.sync({ force: true })
//   .then(() => {
//     console.log('Database synced successfully');
//   })
//   .catch((err) => {
//     console.error('Error syncing database:', err);
//   });

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
