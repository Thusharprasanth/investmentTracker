const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require('method-override')
const Investment  = require('./models/investment')
const passport = require('passport')
const LocalStratergy = require('passport-local')
const User = require('./models/user')
const session = require('express-session')
const flash = require('connect-flash')
const moment = require('moment')

const app = express()


app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
const sessionConfig = {
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly : true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const dburl = "mongodb+srv://thusharprasanth:test1234@investmenttrackercluste.fe76f.mongodb.net/investmentDatabase?retryWrites=true&w=majority"

// mongodb+srv://thusharprasanth:<password>@investmenttrackercluste.fe76f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect(dburl).then(
    (data)=>{
        app.listen(3000,()=>{
            console.log("listening to port 3000");
        })
}
).catch((err)=>console.log(err))

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.moment = moment;
    next()
})

app.get('',async(req,res)=>{
    if(req.user){
    const user = req.user._id;
    investments = await Investment.find({owner:user}).populate('owner')
    balance = 0
    credit = 0
    debit = 0
    for(i of investments){
        balance += i.amount
        if(i.amount<0){
            debit += i.amount
        }else if(i.amount>0){
            credit += i.amount
        }
    }
    res.render('index', {investments, balance, credit, debit})
}
    else{
        res.render('users/login')
    }
    
    
    
   
})
app.post('/investment', async(req,res)=>{
    const investment = new Investment(req.body)
    investment.owner = req.user._id
    await investment.save()
    res.redirect('/',)
})

app.delete('/delete/:id', async(req,res)=>{
    const { id } = req.params
    await Investment.findByIdAndDelete(id)
    res.redirect('/')
})



app.get('/register', (req,res)=>{
    res.render('users/register')
})
app.post('/register', (async(req,res,next)=>{
    try{
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser,err=>{
        if(err) return next(err)
        res.redirect('/investment')
    })
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/login')
    }

} ))

app.get('/login', (req,res)=>{
    res.render('users/login')
})
app.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/register'}),(req,res)=>{
    res.redirect('/')
})
app.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success','Logged Out')
    res.redirect('/login')
})
