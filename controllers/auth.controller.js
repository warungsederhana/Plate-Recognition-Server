const admin = require("../lib/firebase/admin");
const userSchema = require("../schemas/user.schema");
const { getAuth } = require("firebase-admin/auth");
const db = admin.firestore();

exports.signup = async (req, res) => {
  const userData = {
    id: req.body.id,
    email: req.body.email,
    nama: req.body.nama,
  };
  const verifyUser = userSchema.safeParse(userData);

  if (!verifyUser.success) {
    return res.status(400).json({
      success: false,
      message: verifyUser.error,
    });
  }

  const user = {
    ...verifyUser.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await db.collection("Users").doc(user.id).set(user);

    return res.status(201).send({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyToken = async (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    if (!uid) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const userRef = db.collection("Users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Token is valid",
      data: {
        id: uid,
        nama: doc.data().nama,
        email: doc.data().email,
        isAdmin: doc.data().isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(error.code === "auth/id-token-expired" ? 401 : 500).send({
      success: false,
      message: error.message,
    });
  }
};
