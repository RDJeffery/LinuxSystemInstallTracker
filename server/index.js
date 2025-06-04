const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// API endpoint to get system information
app.get('/api/system-info', (req, res) => {
  const scriptPath = path.join(__dirname, '../scripts/get_system_info.sh');
  
  exec(scriptPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return res.status(500).json({ error: 'Failed to get system information' });
    }
    
    try {
      const systemInfo = JSON.parse(stdout);
      res.json(systemInfo);
    } catch (parseError) {
      console.error(`Error parsing script output: ${parseError}`);
      res.status(500).json({ error: 'Failed to parse system information' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 