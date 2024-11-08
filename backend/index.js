const connectToMongo =require('./db');
const cors = require('cors');
const express = require('express')
const app = express()
const path = require('path'); ;

connectToMongo();
const port = 5000;

const  _dirname = path.resolve();
app.use(cors());
app.use(express.json())

app.use('/api/auth',require('./routes/auth'));
app.use('/api/transactions',require('./routes/transactions'));
app.use('/api/category',require('./routes/category'));


app.use(express.static(path.join(_dirname,"/frontend/build/")));

app.get('*' , ((_,res) => {
  res.sendFile(path.resolve(_dirname,"frontend","build","index.html"));
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`CashFLow app listening on port ${port}`)
})