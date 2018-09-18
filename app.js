const express = require('express');

var exphbs  = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

const port = 5002;

app.listen(port,() => {
    console.log(`App is serving on http://localhost:${port}`);
})


app.get("/",(req,res)=>{
    res.render('home');
});