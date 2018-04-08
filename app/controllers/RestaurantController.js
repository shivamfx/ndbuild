'use strict'

var Restaurant = require('../../app/models/restaurant'); // get our mongoose model
var Account = require('../../app/models/account'); // get our mongoose model
var Dish=require('../../app/models/dish')
var Logger = require('../../app/services/loggerService');
var _=require('lodash');

//add by admin updated
exports.addRestaurant = function (req, res) {
  var mobId = req.body.MobId;

  var cuisines = (req.body.Cuisines).split(',');
  var type = (req.body.Type).split(',');
  var time = (req.body.Time).split(',');

  Account.findOne({
      "User.Mob": mobId
  }, function (err, result) {
      if (err) {
          return console.log("error")
      };

      if (result == null) {
          return console.log("not found");
      } else if (result != null) {
          console.log(result);
          var accountId = result._id;

        var geoLocation={type:'Point',
        coordinates:[Number(req.body.Latitude),Number(req.body.longitude)]
        }

          var restaurant = new Restaurant({
              _id: result._id,
              Name: req.body.Name,
              Branch: req.body.Branch,
              Mobile: req.body.Mobile,
              Time: time,
              Cuisines: cuisines,
              Type: type,
              AverageCost: req.body.AverageCost,
              Address: req.body.Address,
              Location: req.body.Location,
              City: req.body.City,
              Latitude: req.body.Latitude,
              Longitude: req.body.Longitude,
              GeoLocation:geoLocation,
              More: req.body.More,
              Deals: req.body.Deals,
              DealsOn: req.body.DealsOn,
              MobId: mobId
          });

          restaurant.save(function (err, result) {


              if (err) {
                  return console.log(err.message);
              }
              if (result != null) {
                  return res.status(200).send('request send successfully');
              }

          });





      }

  });
}



exports.getRestaurants = function (req, res) {

  Restaurant.find({}, {
  }, function (err, request) {
    if (err) {
      Logger.logger(err, null, req.body, 'RestaurantController getResturants 1', 'not able to fetch data in the restaurant');
      return res.status(500);
    }
    if (request == null) {
      Logger.logger(err, null, req.body, 'RestaurantController getResturants 2', 'result empty not found');
      return res.status(400).send("not found");
    } else {
      res.status(200).send({
        data: request
      });
    }
  });

};

//for single restaurant updated
exports.getRestaurant = function (req, res) {
  var resID = req.params.id
  Restaurant.findOne({
    _id: resID
  }, function (err, result) {
    if (err) {
      Logger.logger(err, "", req.body, 'RestaurantController getResturant 3', 'not able to fetch data in the restaurant');
      return res.status(500);
    }
    if (!result) {
      Logger.logger(err, "", req.body, 'RestaurantController getResturant', 'result empty not found');
      return res.status(400).send("not found");
    } else {
      res.status(200).send({
        data: result
      });
    }
  });
}


exports.getDishesinRestaurant=function(req,res)
{
  var resID = req.params.id
  Restaurant.findOne({
    _id: resID
  }, function (err, result) {
    if (err) {
      Logger.logger(err, "", req.body, 'RestaurantController getResturant', 'not able to fetch data in the restaurant');
      return res.status(500);
    }
    if (!result) {
      Logger.logger(err, "", req.body, 'RestaurantController getResturant', 'result empty not found');
      return res.status(400).send("not found");
    } else {
     getDishes(result.Dishes);
    }
  });

     function getDishes(arrDishes)
     {
       console.log(arrDishes);
      Dish.find({_id:{$in:arrDishes}},function(err,result1){
        if (err) {
          Logger.logger(err, "", req.body, 'RestaurantController getDishes','not able to fetch data in the dish');
          return res.status(500);
        }
        if (!result1) {
          Logger.logger(err, "", req.body, 'RestaurantController getDishes', 'result empty not found');
          return res.status(400).send("not found");
        } else {
         //process result in approprate format


      
      var data = _(result1).groupBy('MenuDivision')
    .map(function(items, i) {
      return {
        MenuDivision: i,
        details:items
      };
    }).value();

          res.status(200).send(data);
        }
      });

     }

}


//used any where 
exports.doRestaurantExists = function (req, res) {
  var MobId = req.body.MobId;
  console.log(MobId);
  Account.findOne({
    "User.Mob": MobId
  }, function (err, result) {
    if (err) {
      console.log(err);
    } else if (!result) {

      res.status(200).send({
        success: true,
        value: 0,
        msg: "no user found"
      });
    } else if (result) {
      if (result.Restaurant == null) {
        res.status(200).send({
          success: true,
          value: 1,
          msg: "no restaurant found"
        });
      } else {
        console.log(result.Restaurant);
        res.status(200).send({
          success: true,
          value: 2,
          data: result.Restaurant
        });
      }
    }
  });
}



//work to do if used
exports.editRestaurant = function (req, res) {

  var resturant = new Restaurant();
  Account.findOne({
    _id: req.decoded.id
  }, {
    'Restaurant': 1
  }, function (err, result) {
    if (err) {
      Logger.logger(err, req.decoded.id, req.body, 'RestaurantController editResturant 4', 'not able to fetch data in the restaurant');
      return res.status(500).send({
        success: false,
        message: "Something gone wrong"
      });
    }
    if (!result) {
      Logger.logger(err, req.decoded.id, req.body, 'RestaurantController editResturant 5', 'result empty not found');
      return res.status(400).send({
        success: false,
        message: "not found"
      });
    } else {
      restaurant = result.Restaurant;

      Name = req.body.Name;
      Branch = req.body.Branch;
      Mobile = req.body.Mobile;
      Time = req.body.Time;
      Cuisines = req.body.Cuisines;
      Type = req.body.Type;
      AverageCost = req.body.AverageCost;
      Address = req.body.Address;
      BestDishes = req.body.BestDishes;
      More = req.body.More;
      Deals = req.body.Deals;

      Account.update({
        _id: req.decoded.id
      }, {
        $set: {
          Restaurant: restaurant
        }
      }, function (err, result) {
        if (err) {
          Logger.logger(err, req.decoded.id, req.body, 'RestaurantController editResturant 6', 'not able to add data in the restaurant');
          return res.status(500).send({
            success: false,
            message: "Something gone wrong"
          });
        } else if (result.nModified === 0) {
          Logger.logger(err, req.decoded.id, req.body, 'RestaurantController editResturant 7', 'data not added as nModified==0');
          return res.status(400).send({
            success: false,
            message: "not found"
          });
        } else {
          res.status(200).send({
            success: true,
            message: "request succesfully completed"
          });
        }
      });

    }




  });
};



//work to do create new
var geolib = require('geolib');
exports.getNearRestaurants = function (req, res) {
  var lat = req.body.Latitude;
  var log = req.body.Longitude;

  Account.find({
    'Restaurant': {
      $ne: null
    }
  }, {
    Restaurant: 1
  }, function (err, request) {
    if (err) {
      Logger.logger(err, null, req.body, 'RestaurantController getResturants 1', 'not able to fetch data in the restaurant');
      return res.status(500);
    }
    if (request == null) {
      Logger.logger(err, null, req.body, 'RestaurantController getResturants 2', 'result empty not found');
      return res.status(400).send("not found");
    } else {

      var nearList=request;
      request.forEach(function (item, index, nearList) {

        var distance = geolib.getDistance({
          latitude: lat,
          longitude: log
        }, {
          latitude: "18.592764",//item.Restaurant.Latitude,
          longitude: "73.745258"//item.Restaurant.Longitude
        }, 100);
        
        if ((distance / 1000) > 7) {
         nearList.splice(index, 1);
        }
      
      });
      res.status(200).send(nearList);
    }
  });
}




//work to do create new

var Snapshot = require('../../app/models/snapshot');
var storageServive = require('../../app/services/storageService');
exports.uploadSnapShot = function (req, res) {
  console.log(req.file);
  storageServive.uploadFile(req.file, function (err, Url) {
    if (err) {
      // Logger.logger(error, req.decoded.id, req.body, 'RestaurentController uploadToAzure', 'error while uploading blob');
      return res.status(500).send({
        sucess: false,
        msg: 'error while uploading blob'
      });
    }
    if (Url) {
      var snapshot = new Snapshot({
        ImageURL: Url,
        ImageType: 'menu'
      });

      Account.update({
        _id: req.decoded.id
      }, {
        $push: {
          'Restaurant.Snapshots': snapshot
        }
      }, function (err, result) {

        if (err) {
          //  Logger.logger(error, req.decoded.id, req.body, 'RestaurentController uploadToAzure', 'error while adding in mongo');
          return res.status(500).send({
            sucess: false,
            msg: 'error while adding in mongodb'
          });
        }
        if (result.nModified === 1) {
          res.status(200).send({
            success: true,
            msg: 'request completed sucessfuly'
          });
        }

      });

    }
  });
}