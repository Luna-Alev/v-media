const express = require('express');
const cors = require('cors');
const app = express();

const routes = require('./routes/routes');

app.use(cors());
app.use(express.json());

app.use('/', routes);

app.use(express.static('/var/www/lugeja'));
app.get('/*', (req, res) => {
  res.sendFile(path.join('/var/www/lugeja', 'index.html'));
});

app.listen(3001, () => {
  console.log('server running on port 3001');
});