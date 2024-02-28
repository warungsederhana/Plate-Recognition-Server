const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3344;
dotenv.config();

const authRoutes = require("./routes/auth.route");
const seedersRoutes = require("./routes/seeder.route");
const kendaraanRoutes = require("./routes/kendaraan.route");
const userRoutes = require("./routes/user.route");
const negaraAsalRoutes = require("./routes/negaraAsal.route");
const merkKendaraan = require("./routes/merk.route");
const jenisKendaraan = require("./routes/jenisKendaraan.route");

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
app.use("/api/seeder", seedersRoutes);
app.use("/api/kendaraan", kendaraanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/negara-asal", negaraAsalRoutes);
app.use("/api/merk-kendaraan", merkKendaraan);
app.use("/api/jenis-kendaraan", jenisKendaraan);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
