const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser= require('body-parser');
//contains all the database Schema
require('./models/Schemas');
const test = require('./test/test');
mongoose.connect(keys.mongoURI);

const app = express();

const User = mongoose.model('users');
const currentUser = mongoose.model('currentUser');
const userLogs = mongoose.model('userLogs');
const recordClicks = mongoose.model('recordClicks');
const recordScroll = mongoose.model('recordScroll');
const recordFavorite = mongoose.model('recordFavorite');
const recordSearch = mongoose.model('recordSearch');
const recordCopy = mongoose.model('recordCopy');
const recordTags = mongoose.model('recordTags');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));







app.post('/api/register',function(req,res){
      var username = req.body.username;
      var password = req.body.password;
      //console.log(req.body);


      //checking if user already exists

      User.findOne({username: username, password: password}, function(err,user){

          if(!user){
              console.log("new user");
              var result="";
   	          var d = new Date();
   	          result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
                        " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
                        +" "+d.getMilliseconds();

              //logging data
              new userLogs({timestamp: result , username: username}).save();
              //
              new User({username,password}).save()
              .then((user)=>{
                //res.send('Registered');
                res.redirect('/userlogs');
              });

              //currentUser update
              currentUser.count({}, function(err, res){
                if(res){
                  //console.log(res);
                  currentUser.remove({uselessID:'uselessID'}, function(err, res){
                    //console.log('inside');

                  });
                }
                else{
                //console.log('nothing found');
                }
                new currentUser({uselessID:'uselessID',username}).save();

              });


          }
          else{
            //user already exists
            res.redirect('/registererror');
          }

      });
});


app.post('/api/login', function(req, res){
  console.log('login api called')
  var username = req.body.username;

  var password = req.body.password;
  //console.log('username and password '+username+' '+password);

  User.findOne({username: username, password: password}, function(err, user){
    if(!user){
    //  console.log('New user');
      res.redirect('/errorlogin');
    }
    else{
      //console.log('old user'+user);

      //currentUser update
      currentUser.count({}, function(err, res){
        if(res){
          console.log(res);
          currentUser.remove({uselessID:'uselessID'}, function(err, res){
            //console.log('inside');

          });
        }
        else{
        //console.log('nothing found');
        }
        new currentUser({uselessID:'uselessID',username}).save();

      });
      var result="";
      var d = new Date();
      result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
                " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
                +" "+d.getMilliseconds();

      //log user sign-in in
      new userLogs({timestamp: result, username: username}).save();
      res.redirect('/userlogs');
    }
  });


});




app.post('/api/clicks', function(req, res){
  console.log('clicks api called');
  var timestamp = req.body.timestamp;
  var currentUrl = req.body.currentUrl;
  var redirectUrl = req.body.redirectUrl;
  var result="";
  var d = new Date();
  result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
            " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
            +" "+d.getMilliseconds();

  currentUser.findOne({uselessID:'uselessID'}, function(err, res){
    username = res.username;
    //console.log('res='+res);
    new recordClicks({timestamp:result, username, currentUrl, redirectUrl}).save();
  });
  //console.log('current user found:'+user+ '\nother stuff: '+timestamp+currentUrl+redirectUrl);

});

app.post('/api/favorite', function(req, res){
  console.log('favorite api called');
  var timestamp = req.body.timestamp;
  var favoriteUrl = req.body.favoriteUrl;
  var favoriteQuestion = req.body.favoriteQuestion;
  var result="";
  var d = new Date();
  result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
            " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
            +" "+d.getMilliseconds();

  currentUser.findOne({uselessID:'uselessID'}, function(err, res){
    username = res.username;
    //console.log('res='+res);
    new recordFavorite({timestamp:result, username, favoriteUrl, favoriteQuestion}).save();
  });
  //console.log('current user found:'+user+ '\nother stuff: '+timestamp+currentUrl+redirectUrl);

});

app.post('/api/scroll', function(req, res){
  console.log('scroll api called');
  var timestamp = req.body.timestamp;
  var scrollPercentage = req.body.scrollPercentage;
  var scrollUrl = req.body.scrollUrl;
  var result="";
  var d = new Date();
  result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
            " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
            +" "+d.getMilliseconds();

  currentUser.findOne({uselessID:'uselessID'}, function(err, res){
    username = res.username;
    //console.log('res='+res);
    new recordScroll({timestamp:result, username, scrollPercentage, scrollUrl}).save();
  });
  //console.log('current user found:'+user+ '\nother stuff: '+timestamp+currentUrl+redirectUrl);

});

app.post('/api/search', function(req, res){
  console.log('search api called');
  var timestamp = req.body.timestamp;
  var searchUrl = req.body.searchUrl;
  var result="";
  var d = new Date();
  result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
            " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
            +" "+d.getMilliseconds();

  currentUser.findOne({uselessID:'uselessID'}, function(err, res){
    username = res.username;
    //console.log('res='+res);
    new recordSearch({timestamp:result, username, searchUrl}).save();
  });
  //console.log('current user found:'+user+ '\nother stuff: '+timestamp+currentUrl+redirectUrl);

});

app.post('/api/copy', function(req, res){
  console.log('copy api called');
  var timestamp = req.body.timestamp;
  var copyUrl = req.body.copyUrl;
  var result="";
  var d = new Date();
  result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
            " "+ d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
            +" "+d.getMilliseconds();

  currentUser.findOne({uselessID:'uselessID'}, function(err, res){
    username = res.username;
    //console.log('res='+res);
    new recordCopy({timestamp:result, username, copyUrl}).save();
  });
  //console.log('current user found:'+user+ '\nother stuff: '+timestamp+currentUrl+redirectUrl);

});



app.get('/api/userlogs', async function(req, res){
  const logs = await userLogs.find();
  var time = logs.map(function(x){

     console.log(x.username);
      return x.username+'*'+x.timestamp.substring(0,9);
   });
   res.send(time);

});




app.get('/api/clicklinks', async function(req, res){

      var searchDictionary ={};
      //searching for users and making keys for our dictionary
      //console.log("Api called");
      const users = await User.find();
      //console.log(users);
      if (users){
            //console.log('inside if');

            users.map(function(x){
               //console.log(x.username);
               searchDictionary['inside'+x.username]=0;
               searchDictionary['outside'+x.username]=0;
             });
              searchDictionary['all-inside']=0;
              searchDictionary['all-outside']=0;

            //console.log(searchDictionary);
            //res.send('Heyo');
            const clicks = await recordClicks.find();
            if(clicks){
              //console.log(clicks);
                clicks.map( function(x){
                  if(x.redirectUrl.substring(0,4)=="http"){
                      //console.log('outside '+x.redirectUrl);
                      searchDictionary['outside'+x.username]+=1;
                      searchDictionary['all-outside']+=1;
                  }
                  else{
                      //console.log('inside '+x.redirectUrl);
                      searchDictionary['inside'+x.username]+=1;
                      searchDictionary['all-inside']+=1;
                  }

                });

            }
            else {
              res.send('error');
            }
         }
      else{
        //console.log("error");
        res.send('Failo');
      }

      console.log(searchDictionary);

      res.send(searchDictionary);

});

app.get('/api/gettags', async function(req,res){

  const alltags = await recordTags.find();
  if(alltags){
    tags = alltags.map(function(x){
      console.log(x.tags);
      return x.username+x.tags;

     });
     res.send(tags);
  }
  else{
    res.send('error');
  }

});

app.get('/api/allinteractions', async function(req,res){

  const clicks = await recordClicks.find();
  const search = await recordSearch.find();
  const scrolls = await recordScroll.find();
  const user = await User.find();


  if(user){

      user.map(function(x){
      return x.tags;

     });
     res.send("success");
  }
  else{
    res.send('error');
  }

});




app.get('/api/getallusers', async function(req, res){
    const allusers = await User.find();
    if(allusers){


      var result = allusers.map(function(x){
        return x.username;
      });
      //console.log(result);
      res.send(result);
    }
    else{
      res.send('error');
    }

});

app.get('/api/getcurrentuser', async function(req, res){
  cuser = await currentUser.findOne({uselessID:'uselessID'});
  //console.log('\nCCCCurrent user'+cuser.username);
  res.send(cuser.username);

});





//----Production stuff----
if(process.env.NODE_ENV == 'production'){
  //serving main.js or main.css
    app.use(express.static('client/build'));

    //fallback option
    const path = require('path');
    app.get('*', (req,res) =>{
      res.sendFile(path.resolve(
          __dirname,'client', 'build', 'index.html'));

    });
}




/*---Dynamic port binding done here----
    Use 5000 port in development otherwise
    let Heroku decide dynamically
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT);
