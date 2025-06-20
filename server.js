const express = require('express');
const app = require('./api/index'); // Import from serverless version

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});
