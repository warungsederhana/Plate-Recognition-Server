const kendaraanSchema = require("../Schemas/kendaraan.schema");
const { z } = require("zod");
const admin = require("../lib/firebase/admin");
const {
  updateTimestampsInObject,
  convertDatesToFirestoreTimestamps,
  convertStringsToDateObjects,
} = require("../utils/converter.util");
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
  const { uid } = req.params;
  try {
    const kendaraan = await db.collection("Kendaraan").doc(uid).get();
    const data = kendaraan.data();

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Kendaraan not found",
      });
    }

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

exports.createKendaraan = async (req, res) => {
  try {
    const newKendaraan = req.body;
    const updatedKendaraan = convertStringsToDateObjects(newKendaraan);
    const validatedKendaraan = kendaraanSchema.safeParse(updatedKendaraan);
    if (!validatedKendaraan.success) {
      const errors = [];
      for (const error of validatedKendaraan.error.issues) {
        errors.push(`${error.path}: ${error.message}`);
      }
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    const kendaraanId = validatedKendaraan.data.id;
    const q = db.collection("Kendaraan").where("id", "==", kendaraanId);
    const kendaraanSnaphot = await q.get();
    const kendaraans = kendaraanSnaphot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (kendaraans.length > 0) throw new Error("Kendaraan already exists");

    const docRef = db.collection("Kendaraan").doc();
    const dataKendaraan = {
      uid: docRef.id,
      ...validatedKendaraan.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await docRef.set(dataKendaraan);

    res.status(200).json({
      success: true,
      message: "Create kendaraan successfully",
      data: dataKendaraan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateKendaraan = async (req, res) => {
  const { uid } = req.params;
  const updatedKendaraan = req.body;

  try {
    const docRef = db.collection("Kendaraan").doc(uid);
    const kendaraan = await docRef.get();

    if (!kendaraan.exists) {
      return res.status(404).json({
        success: false,
        message: "Kendaraan not found",
      });
    }

    const updatedData = convertStringsToDateObjects(updatedKendaraan);
    const validatedKendaraan = kendaraanSchema.safeParse(updatedData);

    console.log(updatedData);

    if (!validatedKendaraan.success) {
      const errors = [];
      for (const error of validatedKendaraan.error.issues) {
        errors.push(`${error.path}: ${error.message}`);
      }
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    await docRef.update({
      ...validatedKendaraan.data,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Update kendaraan successfully",
      data: updateTimestampsInObject(updatedDoc.data()),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteKendaraan = async (req, res) => {
  const { uid } = req.params;

  try {
    const docRef = db.collection("Kendaraan").doc(uid);
    const kendaraan = await docRef.get();

    if (!kendaraan.exists) {
      return res.status(404).json({
        success: false,
        message: "Kendaraan not found",
      });
    }

    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Delete kendaraan successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
