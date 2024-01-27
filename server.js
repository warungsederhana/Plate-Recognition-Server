const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3344;
dotenv.config();

const authRoutes = require("./routes/auth.route");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({
    msg: "Hello World!",
  });
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
