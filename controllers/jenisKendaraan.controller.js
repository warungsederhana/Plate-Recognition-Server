const jenisKendaraanSchema = require("../Schemas/jenisKendaraan.schema");
const admin = require("../lib/firebase/admin");
const {
  updateTimestampsInObject,
  convertStringsToDateObjects,
} = require("../utils/converter.util");
const db = admin.firestore();

exports.getAllJenisKendaraan = async (req, res) => {
  try {
    const jenisKendaraans = await db.collection("JenisKendaraan").get();
    const data = jenisKendaraans.docs.map((doc) => doc.data());

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get all jenis kendaraan successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createJenisKendaraan = async (req, res) => {
  try {
    const jenisKendaraan = req.body;

    const validData = jenisKendaraanSchema.safeParse(jenisKendaraan);
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

    // Cek apakah id sudah ada
    const idQuery = db.collection("JenisKendaraan").where("id", "==", validData.data.id);
    const idSnapshot = await idQuery.get();
    const jenisKendaraanIds = idSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (jenisKendaraanIds.length > 0) throw new Error("Id jenis kendaraan already exists");

    // Cek apakah nama_jenis_kendaraan sudah ada
    const namaQuery = db
      .collection("JenisKendaraan")
      .where("nama_jenis_kendaraan", "==", validData.data.nama_jenis_kendaraan);
    const namaSnapshot = await namaQuery.get();
    const jenisKendaraanNamas = namaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (jenisKendaraanNamas.length > 0) throw new Error("Nama jenis kendaraan already exists");

    // Cek apakah kode_jenis_kendaraan sudah ada
    const kodeQuery = db
      .collection("JenisKendaraan")
      .where("kode_jenis_kendaraan", "==", validData.data.kode_jenis_kendaraan);
    const kodeSnapshot = await kodeQuery.get();
    const jenisKendaraanKodes = kodeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (jenisKendaraanKodes.length > 0) throw new Error("Kode jenis kendaraan already exists");

    const docRef = db.collection("JenisKendaraan").doc();
    const dataJenisKendaraan = {
      uid: docRef.id,
      ...validData.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await docRef.set(dataJenisKendaraan);

    return res.status(201).json({
      success: true,
      message: "Create jenis kendaraan successfully",
      data: dataJenisKendaraan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getJenisKendaraanById = async (req, res) => {
  const { uid } = req.params;

  try {
    const jenisKendaraan = await db.collection("JenisKendaraan").doc(uid).get();
    const data = jenisKendaraan.data();

    if (!data) throw new Error("Jenis kendaraan not found");

    const validData = updateTimestampsInObject(data);
    return res.status(200).json({
      success: true,
      message: "Get jenis kendaraan by id successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateJenisKendaraan = async (req, res) => {
  const { uid } = req.params;
  const updatedJenisKendaraan = req.body;

  try {
    const docRef = db.collection("JenisKendaraan").doc(uid);
    const jenisKendaraan = await docRef.get();

    if (!jenisKendaraan.exists) throw new Error("Jenis kendaraan not found");

    const updatedData = convertStringsToDateObjects(updatedJenisKendaraan);

    const validatedJenisKendaraan = jenisKendaraanSchema.safeParse(updatedData);
    if (!validatedJenisKendaraan.success) {
      const errors = [];
      for (const error of validatedJenisKendaraan.error.issues) {
        errors.push(`${error.path}: ${error.message}`);
      }
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    await docRef.update({
      ...validatedJenisKendaraan.data,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef.get();

    return res.status(200).json({
      success: true,
      message: "Update jenis kendaraan successfully",
      data: updateTimestampsInObject(updatedDoc.data()),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteJenisKendaraan = async (req, res) => {
  const { uid } = req.params;

  try {
    const docRef = db.collection("JenisKendaraan").doc(uid);
    const jenisKendaraan = await docRef.get();

    if (!jenisKendaraan.exists) throw new Error("Jenis kendaraan not found");

    await docRef.delete();

    return res.status(200).json({
      success: true,
      message: "Delete jenis kendaraan successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
