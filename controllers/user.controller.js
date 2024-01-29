const admin = require("../lib/firebase/admin");
const userSchema = require("../Schemas/user.schema");
const db = admin.firestore();

// get all users
exports.getAllUsers = async (req, res) => {
  console.log("Get all users");
  try {
    const users = await db.collection("Users").get();
    const data = users.docs.map((doc) => doc.data());

    return res.status(200).json({
      success: true,
      message: "Get all users successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user profile by id
exports.getUserById = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await db.collection("Users").doc(userId).get();
    const data = user.data();

    return res.status(200).json({
      success: true,
      message: "Get user by id successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
