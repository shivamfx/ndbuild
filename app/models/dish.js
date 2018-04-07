var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Dish', new Schema({
    DishImgUrl:{type:String,default:null},
    Name:{type:String,default:null},//name of dish,sredded pizza
    GeneralName:{type:String,default:null},//pizza,burger
    SpecificName:{type:String,default:null},//ginger tea,methi paraha
    MenuDivision:{type:String,default:null},//categorization for menu combos,starter,main course,bread,dessert &beverages etc.
    ParentCuisine:{type:String,default:"INDIAN"},//cuisine contry wise if no cuisine is defined then it is shown.
    Cuisines:[{type:String,default:null}],//italian,north indian ,south indian
    Type:[{type:String,default:null}],//breakfast,Mains,snacks,dinner,desert,beverage.
    IsVegan:{type:Boolean,default:false},
    IsNew:{type:Boolean,default:false},
    Sort:{type:Number,default:50},
    SpecialIndt:[{type:String,default:null}],//special indigrent
    Description:{type:String,default:null},
    Price:{type:String,default:null},
    RestaurantName_linked:{type:String,default:null},
    Latitude_linked:{type:String,default:null},
    Longitude_linked:{type:String,default:null},
    GeoLocation_linked:{type:Schema.Types.Mixed,default:null},
    City_linked:{type:String,default:null},
    CityBest:{type:Number,default:0},
    LocalBest:{type:Number,default:0},
    DishMapId:{type:Schema.Types.ObjectId,default:null},//id from Dish Map
    RestaurantId:{type:Schema.Types.ObjectId,default:null},
    Created: {type:Date,default:Date.now}
}));