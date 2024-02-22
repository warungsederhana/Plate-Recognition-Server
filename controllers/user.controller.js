const admin = require("../lib/firebase/admin");
const userSchema = require("../Schemas/user.schema");
const { removeUndefinedProps } = require("../utils/validation.util");
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

// update user profile by id
exports.updateUserById = async (req, res) => {
  console.log("Update user by id");
  const userId = req.user.id;

  const { email, nama, nik, alamat, id_kendaraan, id_tagihan_pajak, id_pembayaran_pajak } =
    req.body;

  const newUserData = {
    id: userId,
    email,
    nama,
    nik,
    alamat,
    id_kendaraan,
    id_tagihan_pajak,
    id_pembayaran_pajak,
  };

  const validatedUserData = userSchema.safeParse(newUserData);
  if (!validatedUserData.success) throw new Error(validatedUserData.error);

  try {
    const userRef = db.collection("Users").doc(userId);

    const validData = removeUndefinedProps(validatedUserData.data);

    console.log(validData);

    const dataUpdate = {
      ...validData,
      updatedAt: new Date().toISOString(),
    };

    await userRef.set(dataUpdate, { merge: true });

    const userData = await userRef.get();
    const data = userData.data();

    return res.status(200).json({
      success: true,
      message: "Update user by id successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
