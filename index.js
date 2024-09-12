const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");  // Import the CORS package
dotenv.config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/userRoutes");
const postRouter = require("./Routes/postRoutes");
const replyRouter = require("./Routes/replyRoute");

// Middleware
app.use(cors());  // Enable CORS for all origins
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Test route
app.get('/', (req, res) => {
  res.send("running...");
});

// Apply /api/v1 prefix to routers
app.use('/api/v1', userRouter);
app.use('/api/v1', postRouter);
app.use('/api/v1', replyRouter);

// Start server
app.listen(port, () => {
  console.log(`App is listening at port:${port}`);
});
