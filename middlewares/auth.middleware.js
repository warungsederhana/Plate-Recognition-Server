const admin = require("../lib/firebase/admin");
const userSchema = require("../Schemas/user.schema");
const db = admin.firestore();
const { checkAuthHeader } = require("../utils/validation.util");

const isUserMiddleware = async (req, res, next) => {
  if (!checkAuthHeader(req, res)) return;

  const token = req.headers.authorization.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const id = decodedToken.uid;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userRef = db.collection("Users").doc(id);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = doc.data();

    return next();
  } catch (error) {
    res.status(error.code === "auth/id-token-expired" ? 401 : 500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { isUserMiddleware };
