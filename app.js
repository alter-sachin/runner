var runnr = require('roadrunnr');




var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

// get walking directions from central park to the empire state building
var http = require("http");
url_1 = "http://eattreat.in/api/v1/orders?q[s]=id%20desc&token=89c683b3edc8bdf4d84700aa0b2e63227bc3cb3bc28266e8";
//ORDERS API
//GET LATEST ORDER INFORMATION
//

// get is a simple wrapper for request()
// which sets the http method to GET
var request = http.get(url_1, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
       // console.log(buffer);
        //console.log("\n");
        data = JSON.parse(buffer);
        order = data.orders[0];
        global.order_number = order["number"];
        global.order_id = order["id"];
        global.order_total = order["total"];
        callLineItems(order_number); 
        // extract the distance and time
        //console.log("Order Id: " + order["id"]);
        //console.log("Order Number: " + order["number"]);
    }); 
}); 

function callLineItems(id){
  console.log(id);
  url_2 = "http://eattreat.in/api/v1/orders/"+id+"?token=89c683b3edc8bdf4d84700aa0b2e63227bc3cb3bc28266e8";
  var request = http.get(url_2, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        //console.log(buffer);
        //console.log("\n");
        data = JSON.parse(buffer);
        order_details = data;
        global.order_name = order_details["line_items"][0]["variant"]["name"];
        global.created_at = order_details["created_at"];
        var order_bill_address = order_details["bill_address"];
        global.full_name = order_bill_address["full_name"];
        global.address1 = order_bill_address["address1"];
        global.address2 = order_bill_address["address2"];
        global.city = order_bill_address["city"];
        global.zipcode = order_bill_address["zipcode"];
        global.phone = order_bill_address["phone"];
        global.email = order_bill_address["email"];
        global.permalink = order_details["line_items"][0]["variant"]["slug"];

        callTaxonsCheck(permalink);
        //var order_id = order[""];
        //callLineItems(order_id); 
        // extract the distance and time
        //console.log(order_bill_address);
        console.log(full_name);
        console.log(address1);
        console.log(address2);
        console.log(city);
        console.log(zipcode);
        console.log(phone);
        //console.log("Order Number: " + order["number"]);
    }); 
}); 
}

function callTaxonsCheck(permalink){
  console.log(permalink);
  url_3 = "http://eattreat.in/api/v1/products/"+permalink+"?token=89c683b3edc8bdf4d84700aa0b2e63227bc3cb3bc28266e8";
  var request = http.get(url_3, function (response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event    
    var buffer = "", 
        data,
        route;

    response.on("data", function (chunk) {
        buffer += chunk;
    }); 

    response.on("end", function (err) {
        // finished transferring data
        // dump the raw data
        //console.log(buffer);
        //console.log("\n");
        data = JSON.parse(buffer);
        var taxon_ids = data["taxon_ids"];
        console.log(taxon_ids);
        var stores = [42,43,45,46,48,49,51,52,62,69,141,145,171];
        var found = false;
        for (var i = 0; i < stores.length; i++) {
          if (taxon_ids.indexOf(stores[i]) > -1) {
            found = true;
            break;
          }
        }
        console.log(found);
        if(found){
          initiateLogistics();
        }
    }); 
}); 

}

function initiateLogistics(){
    var CLIENT_ID = '8YPAOZ6QxOrbUXufeFEZKbQjUNL3eyvFmNLKs5zb';
    var CLIENT_SECRET = '7vuZSqnxabzl00cw3D58PsASd45UAxNZvpvuOLo5';
    runnr.setKeys(CLIENT_ID,CLIENT_SECRET);
    var orderRequest = new runnr.OrderRequest();
    runnr.setEnvironment('test');
    // Add pickup details
    orderRequest.pickup.user.name                           = full_name;
    orderRequest.pickup.user.phone_no                       = phone;
    orderRequest.pickup.user.email                          = email;
    orderRequest.pickup.user.type                           = 'normal';
    orderRequest.pickup.user.external_id                    = '123';
    orderRequest.pickup.user.full_address.address           = '1321';
    orderRequest.pickup.user.full_address.locality.name     = 'Sector 9 (Chandigarh)'; // Can be skipped, see below
    orderRequest.pickup.user.full_address.sub_locality.name = 'Sector 9 (Chandigarh)'; // Can be skipped, see below
    orderRequest.pickup.user.full_address.city.name         = 'Chandigarh';
 //   orderRequest.pickup.user.full_address.geo.latitude      = "plat"; // Optional, string format
   // orderRequest.pickup.user.full_address.geo.longitude     = "plng"; // Optional, string format


    // Add drop details
    orderRequest.drop.user.name                             = full_name;
    orderRequest.drop.user.phone_no                         = phone;
    orderRequest.drop.user.email                            = email;
    orderRequest.drop.user.type                             = 'normal';
    orderRequest.drop.user.external_id                      = '123';
    orderRequest.drop.user.full_address.address             = '123';
    orderRequest.drop.user.full_address.locality.name       = 'Sector 9 (Chandigarh)'; // Can be skipped, see below
    orderRequest.drop.user.full_address.sub_locality.name   = 'Sector 9 (Chandigarh)'; // Can be skipped, see below
    orderRequest.drop.user.full_address.city.name           = 'Chandigarh';
    //orderRequest.drop.user.full_address.geo.latitude        = "dlat"; // Optional, string format
    //orderRequest.drop.user.full_address.geo.longitude       = "dlng"; // Optional, string format

    // Order Details
    orderRequest.order_details.order_id                 = order_number;
    orderRequest.order_details.order_value              = order_total;
    orderRequest.order_details.amount_to_be_collected   = order_total;
    orderRequest.order_details.order_type.name          = 'CashOnDelivery';
    orderRequest.order_details.order_items[0].quantity  = 1;
    orderRequest.order_details.order_items[0].price     = 0;
    orderRequest.order_details.order_items[0].item.name = order_name;
    orderRequest.order_details.created_at               = "YYYY-MM-DD hh: MM";

    orderRequest.callback_url = 'your.domain/url'; // OPTIONAL

    runnr.createShipment(orderRequest, function(error, response) {
      console.log(response);
    });

    
    runnr.events.on(runnr.RETRY_ERROR, function(orderId) {
      console.log("Retry failed for orderId: " + orderId); // This is the order_id provided in OrderRequest.order_details.order_id
    });
    runnr.events.on(runnr.RETRY_SUCCESS, function(orderId) {
      console.log("Retry success for orderId: " + orderId); // This is the order_id provided in OrderRequest.order_details.order_id
    });

    var options = {
      retry     : true,
      retryTime : 5 // in seconds
    };


    runnr.createShipment(orderRequest, options, function(error, response) {
      if (error) {
        console.error(error);
      } else {
        console.log(response);
      }
    });


    

}
