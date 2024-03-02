const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

process.on('uncaughtException',(err)=>{
   console.log(err.name ,':', err.message);
   console.log('uncaught exception occured..shuting down..');

})


const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT;

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successfully..");
  })
.catch((err) => {

  console.log("Failed to connect With database..",err);
});

const server = app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server connected successfully on port ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandledRejection occured..shuting down..");

  server.close(() => {
    process.exit(1);
  });
});

