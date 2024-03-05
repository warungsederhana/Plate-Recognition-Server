const merkSchema = require("../Schemas/merkKendaraan.schema");
const admin = require("../lib/firebase/admin");
const {
  updateTimestampsInObject,
  convertStringsToDateObjects,
} = require("../utils/converter.util");
const db = admin.firestore();

exports.getAllMerk = async (req, res) => {
  try {
    const merks = await db.collection("MerkKendaraan").orderBy("createdAt", "desc").get();
    const size = merks.size;
    const data = merks.docs.map((doc) => doc.data());

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get all merk kendaraan successfully",
      size: size,
      title: "MERK KENDARAAN",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createMerk = async (req, res) => {
  try {
    const merk = req.body;
    const validData = merkSchema.safeParse(merk);

    if (!validData.success) {
      const errors = [];
      for (const error of validData.error.issues) {
        errors.push(`${error.path}: ${error.message}`);
      }
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    // cek apakah id sudah ada
    const idQuery = db.collection("MerkKendaraan").where("id", "==", validData.data.id);
    const idSnapshot = await idQuery.get();
    const merkIds = idSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (merkIds.length > 0) throw new Error("ID merk already exists");

    // cek apakah nama_merk sudah ada
    const namaQuery = db
      .collection("MerkKendaraan")
      .where("nama_merk", "==", validData.data.nama_merk);
    const namaSnapshot = await namaQuery.get();
    const merkNamas = namaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (merkNamas.length > 0) throw new Error("Nama merk already exists");

    const docRef = db.collection("MerkKendaraan").doc();
    const dataMerk = {
      uid: docRef.id,
      ...validData.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await docRef.set(dataMerk);

    return res.status(200).json({
      success: true,
      message: "Create merk kendaraan successfully",
      data: dataMerk,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMerkById = async (req, res) => {
  const { uid } = req.params;
  try {
    const merk = await db.collection("MerkKendaraan").doc(uid).get();
    const data = merk.data();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Merk not found",
      });
    }

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get merk kendaraan by id successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMerk = async (req, res) => {
  const { uid } = req.params;
  const updatedMerk = req.body;

  try {
    const docRef = db.collection("MerkKendaraan").doc(uid);
    const merk = await docRef.get();

    if (!merk.exists) {
      return res.status(404).json({
        success: false,
        message: "Merk not found",
      });
    }

    const updatedData = convertStringsToDateObjects(updatedMerk);
    const validatedMerk = merkSchema.safeParse(updatedData);

    if (!validatedMerk.success) {
      const errors = [];
      for (const error of validatedMerk.error.issues) {
        errors.push(`${error.path}: ${error.message}`);
      }
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    await docRef.update({
      ...validatedMerk.data,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Update merk kendaraan successfully",
      data: updateTimestampsInObject(updatedDoc.data()),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMerk = async (req, res) => {
  const { uid } = req.params;

  try {
    const docRef = db.collection("MerkKendaraan").doc(uid);
    const merk = await docRef.get();

    if (!merk.exists) {
      return res.status(404).json({
        success: false,
        message: "Merk not found",
      });
    }

    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Delete merk kendaraan successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ambil data 5 merk terbaru
exports.getLatestMerk = async (req, res) => {
  try {
    const merks = await db
      .collection("MerkKendaraan")
      .orderBy("createdAt", "desc")
      .limit(5)
      .select("id", "nama_merk", "kode_negara_asal")
      .get();
    const data = merks.docs.map((doc) => doc.data());

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get latest merk kendaraan successfully",
      title: "MERK KENDARAAN",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
