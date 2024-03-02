
const express = require('express');
const app = express();
const path = require('path');
const filepath = path.join(__dirname,'public/image');
const morgan = require('morgan');

// app.use(express.static(filepath));
app.use('/public/image',express.static(filepath));
app.use(express.json());
app.use(express.urlencoded({extended :false}));
app.use(morgan('dev'));

const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const customError = require('./utilis/customError')
const globalErrorHandler = require('./controller/ErrorController');


app.use('/api/v1/admin/',adminRoutes);
app.use('/api/v1/products/',productRoutes);


app.all('*',(req,res ,next)=>{
    // const err = new Error(`can not find URL ${req.originalUrl} on server`);
    // err.status = 'fail',
    // err.statusCode = 404;
    
     const err = new customError(`can't find URL ${req.originalUrl} on the server..`,404)

    next(err)
})

app.use(globalErrorHandler);
module.exports = app ;
