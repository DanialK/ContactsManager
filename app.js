
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose =  require('mongoose')
  , http = require('http')
  , path = require('path');

var app = express();
mongoose.connect("mongodb://localhost/contactmanager");
var ContactsSchema = new mongoose.Schema({
  first_name : String,
  last_name : String,
  email_address: String,
  mobile_number : String
});
var Contacts = mongoose.model("contacts",ContactsSchema);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get("/contacts", function(req,res){
  Contacts.find({},function(err,docs){
    if(err) throw err;
    res.send(docs);
  });
});

app.post("/contacts", function(req, res){
  var contact = new Contacts({
    first_name :req.body.first_name,
    last_name :req.body.last_name,
    email_address:req.body.email_address,
    mobile_number :req.body.mobile_number
  }).save(function(err,docs){
    if(err) throw err;
    res.send(docs);
  });
});

app.put("/contacts/:id", function(req,res){
  var id = req.params.id;
  Contacts.findById(id, function(err, contact) {
      if(err) throw err;
      contact.first_name = req.body.first_name,
      contact.last_name = req.body.last_name,
      contact.email_address= req.body.email_address,
      contact.mobile_number = req.body.mobile_number
      contact.save(function(err) {
        if(err) throw err;
        res.send(contact);
      });
    });
});

app.del("/contacts/:id", function(req,res){
  var id = req.params.id;
  Contacts.findById(id, function(err, contact) {
      contact.remove(function(err) {
        if(err) throw err;
        
      });
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
