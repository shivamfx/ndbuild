'use strict'

var Restaurant = require('../../app/models/restaurant'); // get our mongoose model
var Account = require('../../app/models/account'); // get our mongoose model
var Dish = require('../../app/models/dish');
var Logger = require('../../app/services/loggerService');






//updated
exports.addDish = function (req, res) {
    //By Admin
    var mobId = req.body.MobId;



    Restaurant.findOne({
        MobId: mobId
    }, function (err, result2) {
        if (err) {
            return console.log("error")
        };

        if (result2 == null) {
            return console.log("not found");
        } else if (result2 != null) {
            ////////////

            var cuisine = (req.body.Cuisines).split(',');
            var type = (req.body.Type).split(',');
            var specialIndt = (req.body.SpecialIndt).split(',');

            var dish = new Dish({

                DishImgUrl: req.body.DishImgUrl,
                Name: req.body.Name, //name of dish,sredded pizza
                GeneralName: req.body.GeneralName, //pizza,burger
                MenuDivision:req.body.MenuDivision,
                Cuisines: cuisine, //italian,north indian ,south indian
                Type: type, //breakfast,Mains,snacks,dinner,desert,beverage.
                IsVegan: req.body.IsVegan,
                IsNew: req.body.IsNew,
                Sort: req.body.Sort,
                SpecialIndt: specialIndt, //special indigrent
                Description: req.body.Description,
                Price: req.body.Price,
                RestaurantName_linked: result2.Name,
                Latitude_linked: result2.Latitude,
                Longitude_linked: result2.Longitude,
                GeoLocation_linked: result2.GeoLocation,
                City_linked: result2.City,
                CityBest: req.body.CityBest,
                LocalBest: req.body.LocalBest,
                DishMapId: req.body.DishMapId, //id from Dish Map
                RestaurantId: result2._id
            });

            dish.save(function (err, result3) {
                if (err) {
                    return console.log("err");
                }

                if (result3 == null) {
                    return console.log("null");
                } else if (result3 != null) {
                    console.log(result3._id);

                    Restaurant.update({
                        _id: result2._id
                    }, {
                        $addToSet: {
                            Dishes: result3._id
                        }
                    }, function (err, result4) {
                        if (err) {
                            return console.log('error')
                        };

                        if (result4 == null) {
                            return console.log('null')
                        } else if (result4 != null && result4.nModified == 1) {
                            return res.status(200).send('dish added succsessfully');
                        }

                    })
                }

            });



            /////////////
        }
    });



}


//updated
exports.getBestDish2 = function (req, res) {

    var param_cuisines = req.query.cuisines;
    var param_dish = req.query.dish;
    console.log(param_cuisines + " " + param_dish);


    if (param_cuisines === undefined && param_dish === undefined) {
        console.log('in general');
        Dish.find({
            "CityBest": {
                $gt: 0
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                console.log(result)

            } else {
                res.status(200).send({
                    success: true,
                    msg: "request completed sucessfully",
                    data: result
                });
            }

        });
    } else if (param_cuisines !== undefined && param_dish === undefined) {
        console.log("in cuisines");
        Dish.find({
            "Cuisines": param_cuisines,
            "CityBest": {
                $gt: 0
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                console.log(result)

            } else {
                res.status(200).send({
                    success: true,
                    msg: "request completed sucessfully",
                    data: result
                });
            }

        });
    } else if (param_dish !== undefined && param_cuisines === undefined) {
        Dish.find({
            "GeneralName": param_dish,
            "CityBest": {
                $gt: 0
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                console.log(result)

            } else {
                res.status(200).send({
                    success: true,
                    msg: "request completed sucessfully",
                    data: result
                });
            }

        });
    }

    console.log("end");
}

//updated
exports.getDistinctCuisines = function (req, res) {
    Dish.distinct("Cuisines", function (err, result) {
        if (err) {
            Logger.logger(500, err, "", req.body, "BestdishController getDistinctCuisines 100", "500 error");
            return res.status(500).send("Something Went Wrong");

        } else if (!result) {
            console.log("some error occured");
        } else if (result) {
            res.status(200).send({
                success: true,
                msg: "request completed sucessfully",
                data: result
            });

        }

    });
}

//updated
exports.getDistinctCommon_Name = function (req, res) {
    Dish.distinct("GeneralName", function (err, result) {
        if (err) {
            console.log(err);
        } else if (!result) {
            console.log("some error occured");
        } else if (result) {
            res.status(200).send({
                success: true,
                msg: "request completed sucessfully",
                data: result
            });

        }

    });
}

//updated
exports.getAllDistinct = function (req, res) {
    Dish.distinct("Cuisines", function (err, result) {
        if (err) {
            console.log(err);
        } else if (!result) {
            console.log("some error occured");
        } else if (result) {
            console.log(result);
            getCommon_Name(result);

        }


        function getCommon_Name(_cuisines) {
            Dish.distinct("GeneralName", function (err, result) {
                if (err) {
                    console.log(err);
                } else if (!result) {
                    console.log("some error occured");
                } else if (result) {
                    var alldata = [];
                    _cuisines.forEach(function (item) {
                        var obj = {
                            name: item,
                            type: "cuisines"
                        }
                        alldata.push(obj);
                    });
                    result.forEach(function (item) {
                        var obj = {
                            name: item,
                            type: "common_name"
                        }
                        alldata.push(obj);
                    });


                    res.status(200).send(alldata);

                }

            });
        }

    });
}


//updated
exports.getSingleDishDetails = function (req, res) {
    var Id = req.params.id;
    Dish.findOne({
        _id: Id
    }, function (err, result) {
        if (err) {
            console.log(err);
        } else if (result) {
            return res.status(200).send(result);
        }
    });

}



exports.getNearDishes = function (req, res) {
    var lat = Number(req.params.lat);
    var lon = Number(req.params.lon);
    var param_cuisines=req.query.cuisines;
    var param_dish    =req.query.dish;
    var param_cityBest=req.query.citybest;
    var param_localBest=req.query.localbest;
    var query={
        'GeoLocation_linked': {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [lat, lon]
                },
                $maxDistance: 2000
            }
        }
      };
    

    if(param_cityBest!==undefined)
    {
        query.CityBest={$gt:0};
    }
    if(param_localBest!==undefined)
    {
        query.LocalBest={$gt:0};
    }
    if(param_cuisines!==undefined&&param_dish===undefined)
    {
        query.Cuisines=param_cuisines;
    }
    if(param_cuisines===undefined&&param_dish!==undefined)
    {
       query.GeneralName=param_dish;
    }


    Dish.find(query, function (err, request) {
        if (err) {
            Logger.logger(err, null, req.body, 'DishController getNearDishes 1', 'not able to fetch data in the restaurant');
            return res.status(500);
        }
        if (request == null) {
            Logger.logger(err, null, req.body, 'DishController getNearDishes 2', 'result empty not found');
            return res.status(400).send("not found");
        } else {


            res.status(200).send(request);
        }
    });


}