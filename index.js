const express = require('express');
const app = express();

app.get('/',(req,res)=>{
  res.send({hi:'Hola amigo'});
});

/*---Dynamic port binding done here----
    Use 5000 port in development otherwise
    let Heroku decide dynamically
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT);
