require('dotenv').config();
const { ethers } = require('ethers');
let {transferTokens}=require('./transferToken')
const express= require("express")
const hbs= require("hbs")
const path= require("path")
const cookieParser=require("cookie-parser")
const bcrypt= require("bcryptjs")
const auth=require("./middleware/auth")
const app = express()
const { v4: uuidv4 } = require('uuid')
const port= process.env.PORT || 8000
require("./db/connection.js")
const User=require("./models/registers")
const Trnx = require("./models/transactions")
const static_path=path.join(__dirname,"../public")
const template_path = path.join(__dirname,"../templates/views")
const partials_path = path.join(__dirname,"../templates/partials")
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const Wallet = require('ethereumjs-wallet');
const Web3 = require('web3');
const rp = require('request-promise');
const { error } = require('console');
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const bitcoin = new Blockchain();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path)
app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/logout', auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((cur) => {
            if (cur.token !== req.token) {
                return 1
            }
            else {
                return 0
            }
        })

        res.clearCookie("jwtlogin")
        await req.user.save();
        // res.sendFile('login.html', { root: path.join(__dirname, '../public') });

    } catch (error) {
        res.status(401).send(error)
    }
})

// app.get('/register',(req,res)=>{
//     res.sendFile('register.html', { root: path.join(__dirname, '../public') });
// })
// app.get('/confirm',(req,res)=>{
    
//     res.sendFile('confirm.html', { root: path.join(__dirname, '../public') });
// })
// app.get('/bookride',(req,res)=>{
//     console.log('ss')
//     res.sendFile('book.html',{root:path.join(__dirname,'../public')})
// })

// app.get('/login',(req,res)=>{
//     // res.render("login")
//     res.sendFile('login.html', { root: path.join(__dirname, '../public') });
// })
app.post('/login',async (req,res)=>{
    const { enrollmentNumber, password } = req.body;
    try {

        const user = await User.findOne({enrollmentNumber });
        if (!user) {
            const err = new Error('User not found..')
            err.code = 11002
            throw err;
        }
        
        const token=await user.generateAuthToken();
        res.cookie("jwtlogin",token,{
        expires: new Date(Date.now()+300000),
        httpOnly:true
        })
        

        if(user)
        {
            const match=await bcrypt.compare(password,user.password)
            if(match)
            {
                return res.status(200).cookie("token", token).json({status: true,content: {data: { user },},});
            }
            else{
                res.status(400).send("wrong details")
            }
        }
        else{
            res.status(400).send("wrong details this")
        }



    }catch(error){
        console.log(error)
            if(error.code === 11002){
                return res.status(404).json({errors: error.message});
            }else if(error.code === 11003){
                return res.status(401).json({errors: error.message});
            }
    }
})


app.post('/signup',async (req,res)=>{
    
    const { enrollmentNumber, password, studentType } = req.body;
            try{
                // console.log(enrollmentNumber)
                const val = await User.findOne({enrollmentNumber})
                // console.log(val)
                if(val){
                    const error = new Error("Enrollment Id already Exists " +val )
                    error.code = 11001
                    throw error;
                }

                const web3 = new Web3(Web3.givenProvider);
                const account= await web3.eth.accounts.create()
          
                // Get the private key and address of the new account
                const privateKey = account.privateKey;
                const address = account.address;

                // console.log('New account created:');
                // console.log('Address:', address);
                // console.log('Private key:', privateKey);

                const user = await User.create({
                    enrollmentNumber,                    
                    password,
                    studentType,
                    privateKey,
                    address,
                    amount:0
                });
                // console.log("hello guys")
                const token=await user.generateAuthToken();
               
                res.cookie("jwt",token,{
                    expires:new Date(Date.now()+300000),
                    httpOnly:true
                })

                const finalUser= await user.save()
                console.log(finalUser)
                return res.status(200).json({
                    success:'New User Created...',
                    address,
            });
            }catch(e){
                console.log(e)
                if(e.code === 11000) 
                    return res.status(404).json({message:"Duplicate Enrollment Number"})
                else if(e.code === 11001)
                    return res.status(404).json({message:"Enrollment Number Already Exists..!"})
            }
    
})


app.post('/updateBalanceBuy',async(req,res)=>{
    const { enrollmentNumber,amount } = req.body;
    const prev = await User.findOne({enrollmentNumber });
    let user;
    if(prev.amount<3)
    {
        user = await User.updateOne({enrollmentNumber },{"amount":prev.amount+amount});
    }
    else
    {
        const err = new Error('Enough Token...')
        err.code = 11003
        throw err;
    }

    if (!user) {
        const err = new Error('User not found..')
        err.code = 11002
        throw err;
    }
        

    if(user)
    {
        return res.status(200).json({status: true,amount: user.amount});
    }
    else{
        res.status(400).send("wrong details ")
    }
})

app.post('/updateBalanceByHash',async(req,res)=>{
    const { enrollmentNumber ,trnxHash } = req.body;
    try {
        const hash = await Trnx.findOne({trnxHash});
        if(hash)
        {
            const err = new Error('Token Not Valid')
            err.code = 11003
            throw err;
        }
        else{
            const newHash = await Trnx.create({
                trnxHash
            });

            const finalHash= await newHash.save()
        }
        const prev = await User.findOne({enrollmentNumber });
        let user;
        if(prev.amount>0)
        {
            user = await User.updateOne({enrollmentNumber },{"amount":prev.amount-1});
        }
        else
        {
            const err = new Error('Not Enough Token...')
            err.code = 11003
            throw err;
        }

        if (!user) {
            const err = new Error('User not found..')
            err.code = 11002
            throw err;
        }
           

        if(user)
        {
            return res.status(200).json({status: true,amount: user.amount});
        }
        else{
            res.status(400).send("wrong details this")
        }

    }catch(error){
        console.log(error)
            if(error.code === 11002){
                return res.status(404).json({errors: error.message});
            }else if(error.code === 11003){
                return res.status(401).json({errors: error.message});
            }
    }
})

app.get('/balance',async(req,res)=>{
    const { enrollmentNumber } = req.body;
    try {
        // const user = await User.updateOne({enrollmentNumber },{"amount":amount-1});
        const user = await User.findOne({enrollmentNumber });
        if (!user) {
            const err = new Error('User not found..')
            err.code = 11002
            throw err;
        }
           

        if(user)
        {
            return res.status(200).json({status: true,amount: user.amount});
        }
        else{
            res.status(400).send("wrong details this")
        }

    }catch(error){
        console.log(error)
            if(error.code === 11002){
                return res.status(404).json({errors: error.message});
            }else if(error.code === 11003){
                return res.status(401).json({errors: error.message});
            }
    }
})

app.post('/transfer', async( req, res) => {
    let recipientAddress  ; // replace with the recipient's address
    let senderFirstHalfPrivateKey ;
    let senderSecondHalfPrivateKey;
    
    let data =JSON.parse(req.body.rawdata)
    recipientAddress=data.address
    senderFirstHalfPrivateKey = data.firstHalfprivateKey
    senderSecondHalfPrivateKey = data.secondHalfprivateKey
    let senderPrivateKey =senderFirstHalfPrivateKey+senderSecondHalfPrivateKey
    console.log(senderPrivateKey +" gaurav")
    console.log("0xc3f6e5c5066e11b5a4002b2e0d26c5bec3ee0802c65f53fe8fbf1447564a5812")
    const amount = ethers.utils.parseUnits(`${data.amount}`, 18); // replace with the amount of tokens to transfer
    console.log(req.body.recipent +" gaurav")
    recipientAddress= req.body.recipent;
    try{
        let trnxHash = await transferTokens(recipientAddress, amount , senderPrivateKey)
        console.log('Tokens transferred successfully! ' + req.body.recipent);
        // res.json({
        //     Description:`Tokens transferred successfully!`
        // })
        res.status(200).json({"transactionHash":trnxHash })

    }catch(error)
    {
        console.error('Error transferring tokens:', error);
    }
   
})


app.listen(port,()=>{
    console.log("server is working well")
})