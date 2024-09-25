const connectToMongo =require('./db');
const cors = require('cors');
const express = require('express')
const app = express()

connectToMongo();
const port = 5000;

app.use(cors());
app.use(express.json())

app.use('/api/auth',require('./routes/auth'));
app.use('/api/transactions',require('./routes/transactions'));
app.use('/api/category',require('./routes/category'));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`CashFLow app listening on port ${port}`)
})