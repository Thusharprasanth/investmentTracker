const mongoose = require('mongoose')
const Schema = mongoose.Schema

const investmentSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

Investment = mongoose.model('Investment', investmentSchema)
module.exports = Investment