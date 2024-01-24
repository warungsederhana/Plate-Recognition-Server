const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3333;
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({
    msg: "Hello World!",
  });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
