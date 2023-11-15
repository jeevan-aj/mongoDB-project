const bodyParser = require('body-parser');
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const app = express()
const path = require('path')
const port = 3000;
const User = require('./model/user')

const mongoURI = 'mongodb+srv://jeevan-aj:5sC0cbtrOTKy56AL@cluster0.zgepcqh.mongodb.net/mydatabase'
mongoose.connect(mongoURI)
   


app.use('/',express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())

app.post('/api/register',async (req,res)=> {
    console.log(req.body)
    const {username,password:plaintextpassword} = req.body
    const password = await bcrypt.hash(plaintextpassword,10)
    try{
        const response = await User.create({
            username,
            password
        })
        console.log('user created sucssesfully:',response)
    }
    catch(error){
        console.log(error);
        return res.json({status:'error'})
    }
    
    
}) 

app.listen(port,()=> {
    console.log(`server running at http://localhost:${port}` )
})