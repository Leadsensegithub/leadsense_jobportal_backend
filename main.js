const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require("path");
const fileUpload = require('express-fileupload');
require("dotenv").config();
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// Middleware setup
app.use(express.raw({ limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

// Mount auth routes under '/api/v1'
const API_PATH = '/api/v1';
app.use(API_PATH, require('./routes/users'));

// Serve static files from the "upload" directory
app.use(express.static(path.join(__dirname, "upload")));
app.use("/", express.static("upload"));


// Catch-all route for handling 404 errors
app.use(function (req, res, next) {
  res.status(404).json({ error: true, message: '404: File Not Found' });
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server up and running on", port);
});
