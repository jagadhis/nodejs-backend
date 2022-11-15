require("dotenv").config();
require("./config/Database").connect();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./routes/index.js')
const express = require("express");

const app = express();
 
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
 
app.listen(5000, ()=> console.log('Server running at port 5000'));