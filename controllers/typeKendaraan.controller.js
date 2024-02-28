const typeKendaraanSchema = require("../Schemas/typeKendaraan.schema");
const admin = require("../lib/firebase/admin");
const {
  updateTimestampsInObject,
  convertStringsToDateObjects,
} = require("../utils/converter.util");
const db = admin.firestore();

exports.getAllTypeKendaraan = async (req, res) => {
  try {
    const typeKendaraan = await db.collection("TypeKendaraan").get();
    const data = typeKendaraan.docs.map((doc) => doc.data());

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get all type kendaraan successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createTypeKendaraan = async (req, res) => {
  try {
    const typeKendaraan = req.body;

    const validData = typeKendaraanSchema.safeParse(typeKendaraan);
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
    const idQuery = db.collection("TypeKendaraan").where("id", "==", validData.data.id);
    const idSnapshot = await idQuery.get();
    const typeKendaraanIds = idSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (typeKendaraanIds.length > 0) throw new Error("Id type kendaraan already exists");

    // Cek apakah nama_type_kendaraan sudah ada
    const namaQuery = db
      .collection("TypeKendaraan")
      .where("nama_type_kendaraan", "==", validData.data.nama_type_kendaraan);
    const namaSnapshot = await namaQuery.get();
    const typeKendaraanNamas = namaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (typeKendaraanNamas.length > 0) throw new Error("Nama type kendaraan already exists");

    // Cek apakah nama_type_kendaraan_eri sudah ada
    const namaEriQuery = db
      .collection("TypeKendaraan")
      .where("nama_type_kendaraan_eri", "==", validData.data.nama_type_kendaraan_eri);
    const namaEriSnapshot = await namaEriQuery.get();
    const typeKendaraanEris = namaEriSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (typeKendaraanEris.length > 0) throw new Error("Nama type kendaraan eri already exists");

    // Cek apakah id_jenis_kendaraan ada di db
    const jenisKendaraanQuery = db
      .collection("JenisKendaraan")
      .where("id", "==", validData.data.id_jenis_kendaraan);
    const jenisKendaraanSnapshot = await jenisKendaraanQuery.get();
    const jenisKendaraans = jenisKendaraanSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (jenisKendaraans.length === 0) throw new Error("Id jenis kendaraan not found");

    // Cek apakah id_merk_kendaraan ada di db
    const merkKendaraanQuery = db
      .collection("MerkKendaraan")
      .where("id", "==", validData.data.id_merk_kendaraan);
    const merkKendaraanSnapshot = await merkKendaraanQuery.get();
    const merkKendaraans = merkKendaraanSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (merkKendaraans.length === 0) throw new Error("Id merk kendaraan not found");

    // Cek apakah kode_negara_asal ada di db
    const negaraAsalQuery = db
      .collection("NegaraAsal")
      .where("kode_negara", "==", validData.data.kode_negara_asal);
    const negaraAsalSnapshot = await negaraAsalQuery.get();
    const negaraAsals = negaraAsalSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (negaraAsals.length === 0) throw new Error("Kode negara asal not found");

    const docRef = db.collection("TypeKendaraan").doc();
    const dataTypeKendaraan = {
      uid: docRef.id,
      ...validData.data,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await docRef.set(dataTypeKendaraan);

    return res.status(201).json({
      success: true,
      message: "Create type kendaraan successfully",
      data: dataTypeKendaraan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTypeKendaraanById = async (req, res) => {
  const { uid } = req.params;
  try {
    const typeKendaraan = await db.collection("TypeKendaraan").doc(uid).get();
    const data = typeKendaraan.data();

    if (!data) throw new Error("Type kendaraan not found");

    const validData = updateTimestampsInObject(data);

    return res.status(200).json({
      success: true,
      message: "Get type kendaraan by id successfully",
      data: validData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTypeKendaraan = async (req, res) => {
  const { uid } = req.params;
  const updateTypeKendaraan = req.body;

  try {
    const docRef = db.collection("TypeKendaraan").doc(uid);
    const typeKendaraan = await docRef.get();

    if (!typeKendaraan.exists) throw new Error("Type kendaraan not found");

    const updatedData = convertStringsToDateObjects(updateTypeKendaraan);

    const validatedTypeKendaraan = typeKendaraanSchema.safeParse(updatedData);
    if (!validatedTypeKendaraan.success) {
      const errors = [];
      for (const error of validatedTypeKendaraan.error.issues) {
        errors.push(`${error.path}: ${error.message}`);
      }
      return res.status(400).json({
        success: false,
        message: errors,
      });
    }

    // Cek apakah kode_negara_asal ada di db
    const negaraAsalQuery = db
      .collection("NegaraAsal")
      .where("kode_negara", "==", validatedTypeKendaraan.data.kode_negara_asal);
    const negaraAsalSnapshot = await negaraAsalQuery.get();
    const negaraAsals = negaraAsalSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    if (negaraAsals.length === 0) throw new Error("Kode negara asal not found");

    await docRef.update({
      ...validatedTypeKendaraan.data,
      updated_at: new Date(),
    });
    const updatedTypeKendaraan = await docRef.get();

    return res.status(200).json({
      success: true,
      message: "Update type kendaraan successfully",
      data: updateTimestampsInObject(updatedTypeKendaraan.data()),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTypeKendaraan = async (req, res) => {
  const { uid } = req.params;
  try {
    const docRef = db.collection("TypeKendaraan").doc(uid);
    const typeKendaraan = await docRef.get();

    if (!typeKendaraan.exists) throw new Error("Type kendaraan not found");

    await docRef.delete();

    return res.status(200).json({
      success: true,
      message: "Delete type kendaraan successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
