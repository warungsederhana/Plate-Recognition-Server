const dotenv = require("dotenv");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

module.exports = admin;
