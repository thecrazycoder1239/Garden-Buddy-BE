const app = require('./app');

app.listen(process.env.PORT, err => {
    if(err) console.log(err)
    else console.log(`listening on ${process.env.PORT}`)
})

