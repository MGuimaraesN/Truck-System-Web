require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5200;

const authRoutes = require('./routes/auth.routes');
const veiculoRoutes = require('./routes/veiculo.routes');

app.get('/', (req, res) => {
  res.send('API "Frota Sapiens" is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/veiculos', veiculoRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
