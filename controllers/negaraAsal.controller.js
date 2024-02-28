const negaraSchema = require("../Schemas/negaraAsal.schema");
const admin = require("../lib/firebase/admin");
const {
  updateTimestampsInObject,
  convertStringsToDateObjects,
} = require("../utils/converter.util");
const db = admin.firestore();

exports.getAllNegaraAsal = async (req, res) => {
  try {
    const negaras = await db.collection("NegaraAsal").get();
    const data = negaras.docs.map((doc) => doc.data());

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get all negara asal successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createNegaraAsal = async (req, res) => {
  try {
    const negara = req.body;

    const validData = negaraSchema.safeParse(negara);
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
    const idQuery = db.collection("NegaraAsal").where("id", "==", validData.data.id);
    const idSnapshot = await idQuery.get();
    const negaraIds = idSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (negaraIds.length > 0) throw new Error("Id negara already exists");

    // Cek apakah nama_negara sudah ada
    const namaQuery = db
      .collection("NegaraAsal")
      .where("nama_negara", "==", validData.data.nama_negara);
    const namaSnapshot = await namaQuery.get();
    const negaraNamas = namaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (negaraNamas.length > 0) throw new Error("Nama negara already exists");

    // Cek apakah kode_negara sudah ada
    const kodeQuery = db
      .collection("NegaraAsal")
      .where("kode_negara", "==", validData.data.kode_negara);
    const kodeSnapshot = await kodeQuery.get();
    const negaraKodes = kodeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (negaraKodes.length > 0) throw new Error("Kode negara already exists");

    const docRef = db.collection("NegaraAsal").doc();
    const dataNegara = {
      uid: docRef.id,
      ...validData.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await docRef.set(dataNegara);

    return res.status(200).json({
      success: true,
      message: "Create negara asal successfully",
      data: dataNegara,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getNegaraAsalById = async (req, res) => {
  const { uid } = req.params;
  try {
    const negara = await db.collection("NegaraAsal").doc(uid).get();
    const data = negara.data();

    if (!data) throw new Error("Negara asal not found");

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get negara asal by id successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateNegaraAsal = async (req, res) => {
  const { uid } = req.params;
  const updatedNegara = req.body;

  try {
    const docRef = db.collection("NegaraAsal").doc(uid);
    const negara = await docRef.get();

    if (!negara.exists) throw new Error("Negara asal not found");

    const updatedData = convertStringsToDateObjects(updatedNegara);

    const validatedNegara = negaraSchema.safeParse(updatedData);
    if (!validatedNegara.success) {
      const errors = [];
      for (const error of validatedNegara.error.issues) {
        errors.push(`${error.path}: ${error.message}`);
      }
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    await docRef.update({
      ...validatedNegara.data,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Update negara asal successfully",
      data: updateTimestampsInObject(updatedDoc.data()),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNegaraAsal = async (req, res) => {
  const { uid } = req.params;
  try {
    const docRef = db.collection("NegaraAsal").doc(uid);
    const negara = await docRef.get();

    if (!negara.exists) throw new Error("Negara asal not found");

    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Delete negara asal successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
