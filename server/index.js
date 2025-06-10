const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// API endpoint to get system information
app.get('/api/system-info', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/api/system-info');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching system information:', error.message);
    res.status(500).json({ error: 'Failed to get system information' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 