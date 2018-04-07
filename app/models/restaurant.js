var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Snapshot=require('./snapshot');
var BestDishDetail=require('./bestdishdetail');

module.exports = mongoose.model('Restaurant', new Schema({  
    Name:{type:String,required:[true,"title is required"]},
    Branch:{type:String,required:[true,"branch is required"]},  //locality in particular city.
    Mobile:{type:Number,required:[true,"Mobile is required"]},
    Time:[{type:String,default:null}],//06:30AM to 11:00PM
    Cuisines:[{type:String,default:null}],//Multicusine,Punjabi
    Type:[{type:String,default:null}],//casual dining,Pub
    AverageCost:{type:Number,default:null},//for 2 people
    Address:{type:String,default:null},
    Location:{type:String,default:null},
    City:{type:String,default:null},
    Latitude:{type:String,default:null},
    Longitude:{type:String,default:null},
    GeoLocation:{type:Schema.Types.Mixed,default:null},
    More:{type:String,default:null}, //currently disable      //features in your restaurant--wifi,buffet,smokingArea seperated by commas
    Deals:{type:String,default:null},
    DealsOn:{type:String,default:null},
    Snapshots:[Snapshot.schema],
    Dishes:[{type:Schema.Types.ObjectId}],
    MobId:{type:Number,default:null},
    Created:{type:Date,default:Date.now},
    
}));
