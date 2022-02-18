const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require('method-override')

const app = express()


app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

const dburl = "mongodb+srv://thusharprasanth:test1234@investmenttrackercluste.fe76f.mongodb.net/investmentDatabase?retryWrites=true&w=majority"

// mongodb+srv://thusharprasanth:<password>@investmenttrackercluste.fe76f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect(dburl).then(
    (data)=>{
        app.listen(3000,()=>{
            console.log("listening to port 3000");
        })
}
).catch((err)=>console.log(err))
app.use('',(req,res)=>{
    res.send('Hello')
})

