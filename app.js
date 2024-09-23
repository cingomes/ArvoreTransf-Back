const express = require('express');
const cors = require('cors');
const { testConnection } = require('./src/config/sheets')

testConnection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'https://tree-transfer.vercel.app'
}));

const treeRouter = require('./src/routes/treeRoutes');

app.use('/api/transfers', treeRouter);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(val)) {
      return val;
  }
  if (port >= 0) {
      return port;
  }
  return false;
}
const PORT = normalizePort(process.env.PORT || '3000');
app.set('port', PORT);

app.listen(PORT, () => {
  console.log(`Servidor aberto na porta: ${PORT}`);
});
