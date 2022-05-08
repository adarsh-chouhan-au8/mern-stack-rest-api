require('dotenv').config()
const mongoose = require('mongoose');


process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

//connect to DB
mongoose.connect(process.env.uri,{useNewUrlParser:true},function(){
    console.log('DB connected succesfully')
})


// Start the server
const port = process.env.PORT || 3000;
server = app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});