const admin = require("../lib/firebase/admin");
const db = admin.firestore();

// get all kendaraan
exports.getAllKendaraan = async (req, res) => {
  console.log("Get all kendaraan");
  try {
    const kendaraans = await db.collection("Kendaraan").get();
    const data = kendaraans.docs.map((doc) => doc.data());

    return res.status(200).json({
      success: true,
      message: "Get all kendaraan successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
