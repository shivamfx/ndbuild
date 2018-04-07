'use Strict'

var Logger=require('../../app/services/loggerService');

var DishReview=require('../../app/models/dishreview');

var Review=require('../../app/models/review');

exports.addDishReview=function(req,res){

   
function update()
{
DishReview.update({ "_id": "5a5268de7f20a22b3004bccf", "Reviews.UserId": { "$ne": "54bb2244a3a0f26f885be2a4" } },
{"$push": { "Reviews": { UserId:"54bb2244a3a0f26f885be2a4",Rating:5}}},function(err,result)
{
if(err)
{
    console.log(err)
}
    console.log(result);
});
}


DishReview.find({"_id":"5a5268de7f20a22b3004bccf"}).count(function(err,result){
     
    if(err)
    {
        console.log(err);
    }
    
    if(result===1)
    {
update();
    }
    if(result===0)
    {
        var dishreview=new DishReview({
            _id:"5a5268de7f20a22b3004bccf",
            Reviews:[]
        });
    
    dishreview.save(function(err,result1)
    {
        if(err)
        {
            console.log(err);
        }
        console.log(result1);
        update();
    }) 

   
    }

});

}


