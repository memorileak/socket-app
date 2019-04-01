const express = require('express');
const app = express();
const port = 1206;

app.get('/', (req, res) => {res.send('Hello Tung')});
app.listen(port, () => {console.log(`App is listening on port ${port}`)});