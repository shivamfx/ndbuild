var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Review=require('../models/review');
// better dish feedback by user
module.exports = mongoose.model('DishReview', new Schema({
    Reviews:[Review.schema],
    AverageRating:{type:Number,default:0},
    RatingCount:{type:Number,default:0}
}));