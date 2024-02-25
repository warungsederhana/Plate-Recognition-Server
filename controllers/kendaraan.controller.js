const admin = require("../lib/firebase/admin");
const { updateTimestampsInObject } = require("../utils/converter.util");
const db = admin.firestore();

// get all kendaraan
exports.getAllKendaraan = async (req, res) => {
  console.log("Get all kendaraan");
  try {
    const kendaraans = await db.collection("Kendaraan").get();
    const data = kendaraans.docs.map((doc) => doc.data());

    // Mengubah timestamp menjadi Date, lalu memformatnya
    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get all kendaraan successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getKendaraanById = async (req, res) => {
  console.log("Get kendaraan by id");
  const { id } = req.params;
  try {
    const kendaraan = await db.collection("Kendaraan").doc(id).get();
    const data = kendaraan.data();

    // Mengubah timestamp menjadi Date, lalu memformatnya
    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get kendaraan by id successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
