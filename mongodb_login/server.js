const bodyParser = require('body-parser');
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const app = express()
const path = require('path') 
const port = 3000;
const User = require('./model/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "fsfksdjflsdjfsdjfidsjflsdkfjsoidfhdsfjdskfj##$#$#$K#%$#LKJ#@$"

const mongoURI = 'mongodb+srv://jeevan-aj:5sC0cbtrOTKy56AL@cluster0.zgepcqh.mongodb.net/mydatabase'
mongoose.connect(mongoURI)
   


app.use('/',express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())

app.get('/',(req,res)=> {
     res.sendFile(path.join(__dirname,'static','register.html'))
})

app.post('/api/changePassword',async (req,res)=> {
    const {token, newpassword:plaintextpassword} = req.body;

    if(!plaintextpassword||typeof plaintextpassword!='string'){
       return  res.json({status:'error',error:'invalid passowrod'})
    }
    else if(plaintextpassword.length < 5){
       return res.json({status:'error',error:'minimum 5 characters required'})
    }

    try{
        const user = jwt.verify(token, JWT_SECRET)

        const _id = user.id

        const hashedpassword = await bcrypt.hash(plaintextpassword,10)

        await User.updateOne(
            {_id},{$set:{password:hashedpassword}}
        )

        res.json({status:'ok'})
    }

    catch(error){
        res.json({status:'error',error:'something went wrong'})
        console.log(error); 
    } 

})

app.post('/api/login',async (req,res)=> { 

    const {username,password} = req.body

    const user = await User.findOne({username}).lean() 
    try{
        if(!user){
            res.json({status:'error',error:'invalid username/password'})
        }
    
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({
                id: user._id,
                username: user.username
            },JWT_SECRET)
            res.json({status:'ok', data: token})
        }
        else{
            return res.status(401).json({ status: 'error', error: 'Invalid username/password' });
        }
        
    
    }
    catch(error){
        console.log(error);
        res.json({status:'error',message:'error'})
    }

   
})

app.post('/api/register',async (req,res)=> {
    console.log(req.body)
    const {username,password:plaintextpassword} = req.body
    if(!username || typeof username!=='string'){
        return res.json({status:'error', error:'invalid username'})
    }
    if(!plaintextpassword || typeof plaintextpassword!=='string'){
        return res.json({status:'error', error:'invalid password'})
    }
    if(plaintextpassword.length < 5){
        return res.json({status:'error', error:'minimum length is 5'})
    }
    const password = await bcrypt.hash(plaintextpassword,10)
    try{
        const response = await User.create({
            username,
            password
        })
        console.log('user created sucssesfully:',response)
        
    }
    catch(error){
       if(error.code == 11000){
        return res.json({status:'error', error:'username already exists'})
       }
       if(error) 
        throw error
    }
    res.json({status:'ok'})
    
}) 

app.listen(port,()=> {
    console.log(`server running at http://localhost:${port}` )
})