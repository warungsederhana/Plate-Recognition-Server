const { faker } = require("@faker-js/faker");
const kendaraanSchema = require("../Schemas/kendaraan.schema");
const negaraSchema = require("../Schemas/negaraAsal.schema");
const merkSchema = require("../Schemas/merkKendaraan.schema");
const jenisSchema = require("../Schemas/jenisKendaraan.schema");
const typeSchema = require("../Schemas/typeKendaraan.schema");
const tagihanPajakSchema = require("../Schemas/tagihanPajak.schema");
const admin = require("../lib/firebase/admin");
const db = admin.firestore();

const convertUSDToIDR = (usd, exchangeRate = 14500) => {
  return usd * exchangeRate;
};

const addYearsToDate = (date, yearsToAdd) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + yearsToAdd);
  return newDate;
};

const formatIsoDateToDDMMYYYY = (isoDateString, yearsToAdd = 0) => {
  const date = new Date(isoDateString);
  date.setFullYear(date.getFullYear() + yearsToAdd); // Adding the years

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

exports.negaraSeed = async (req, res) => {
  const collectionName = "NegaraAsal";
  const countries = new Set();
  const countryCodes = new Set();
  const seeds = [];

  while (seeds.length < 10) {
    const countryName = faker.location.country();
    const countryCode = faker.location.countryCode("numeric");

    // Check if country name and country code are unique
    if (!countries.has(countryName) && !countryCodes.has(countryCode)) {
      countries.add(countryName);
      countryCodes.add(countryCode);
      seeds.push({ nama_negara: countryName, kode_negara: countryCode });
    }
  }

  console.log(seeds);

  try {
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    for (const seed of seeds) {
      console.log(`Seeding negara ${seed.nama_negara}...`);
      const docRef = collectionRef.doc();

      const negara = {
        id: docRef.id,
        ...seed,
      };

      const verifyNegara = negaraSchema.safeParse(negara);

      if (verifyNegara.success) {
        batch.set(docRef, {
          ...negara,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    await batch.commit();
    console.log(`Seeding ${collectionName} finished!`);

    res.status(200).send({
      success: true,
      message: "Negara seeded successfully",
    });
  } catch (error) {
    console.log("Error seeding negara", error.message);
    res.status(500).send({
      success: false,
      message: "Error seeding kendaraan",
      error: error.message,
    });
  }
};

exports.merkSeed = async (req, res) => {
  const collectionName = "MerkKendaraan";
  const merks = new Set();
  const merkIds = new Set();
  const seeds = [];

  try {
    const negaraAsal = await db.collection("NegaraAsal").get();
    const negaraAsalCodes = negaraAsal.docs.map((doc) => doc.data().kode_negara);

    while (seeds.length < 10) {
      const merkName = faker.vehicle.manufacturer();
      const merkId = faker.string.numeric({ length: 3 });
      const kodeNegara = faker.helpers.arrayElement(negaraAsalCodes);

      // Check if merk name and merk ID are unique
      if (!merks.has(merkName) && !merkIds.has(merkId)) {
        merks.add(merkName);
        merkIds.add(merkId);
        seeds.push({ id: merkId, nama_merk: merkName, kode_negara_asal: kodeNegara });
      }
    }

    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    for (const seed of seeds) {
      console.log(`Seeding merk ${seed.nama_merk}...`);
      const docRef = collectionRef.doc();

      const verifyMerk = merkSchema.safeParse(seed);
      if (verifyMerk.success) {
        batch.set(docRef, {
          ...seed,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
    await batch.commit();
    console.log(`Seeding ${collectionName} finished!`);

    res.status(200).send({
      success: true,
      message: "Merk seeded successfully",
    });
  } catch (error) {
    console.log("Error seeding merk", error.message);
    res.status(500).send({
      success: false,
      message: "Error seeding merk",
      error: error.message,
    });
  }
};

exports.jenisSeed = async (req, res) => {
  const collectionName = "JenisKendaraan";
  const jenis = new Set();
  const jenisIds = new Set();
  const seeds = [];

  while (seeds.length < 11) {
    const jenisName = faker.vehicle.type();
    const jenisId = faker.string.numeric({ length: 3 });
    const jumlahSumbu = faker.number.int({ min: 4, max: 8 }).toString();

    // Generate kode jenis kendaraan
    const jenisKode =
      jenisName.split(" ").length > 1
        ? jenisName
            .split(" ")
            .map((word) => word[0])
            .join("")
        : jenisName.substring(0, 2).toUpperCase();

    // Check if jenis name and jenis ID are unique
    if (!jenis.has(jenisName) && !jenisIds.has(jenisId)) {
      jenis.add(jenisName);
      jenisIds.add(jenisId);
      seeds.push({
        id: jenisId,
        nama_jenis_kendaraan: jenisName,
        kode_jenis_kendaraan: jenisKode,
        jumlah_sumbu: jumlahSumbu,
      });
    }
  }

  try {
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    for (const seed of seeds) {
      console.log(`Seeding jenis ${seed.nama_jenis_kendaraan}...`);
      const docRef = collectionRef.doc();

      const verifyJenis = jenisSchema.safeParse(seed);
      if (verifyJenis.success) {
        batch.set(docRef, {
          ...seed,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    await batch.commit();
    console.log(`Seeding ${collectionName} finished!`);

    res.status(200).send({
      success: true,
      message: "Jenis kendaraan seeded successfully",
    });
  } catch (error) {
    console.log("Error seeding jenis kendaraan", error.message);
    res.status(500).send({
      success: false,
      message: "Error seeding jenis kendaraan",
      error: error.message,
    });
  }
};

exports.typeSeed = async (req, res) => {
  const collectionName = "TypeKendaraan";
  const types = new Set();
  const typeIds = new Set();
  const seeds = [];

  try {
    const jenisKendaraan = await db.collection("JenisKendaraan").get();
    const jenisKendaraanIds = jenisKendaraan.docs.map((doc) => doc.data().id);
    const merkKendaraan = await db.collection("MerkKendaraan").get();
    const merkKendaraanIds = merkKendaraan.docs.map((doc) => doc.data().id);
    const negaraAsal = await db.collection("NegaraAsal").get();
    const negaraAsalCodes = negaraAsal.docs.map((doc) => doc.data().kode_negara);

    while (seeds.length < 10) {
      const typeName = faker.vehicle.model();
      const typeId = faker.string.numeric({ length: 3 });
      const typeNameEri = typeName.split(" ").join("_").toUpperCase();
      const kodeNegara = faker.helpers.arrayElement(negaraAsalCodes);
      const jenisKendaraanId = faker.helpers.arrayElement(jenisKendaraanIds);
      const merkKendaraanId = faker.helpers.arrayElement(merkKendaraanIds);

      // Check if type name and type ID are unique
      if (!types.has(typeName) && !typeIds.has(typeId)) {
        types.add(typeName);
        typeIds.add(typeId);
        seeds.push({
          id: typeId,
          nama_type_kendaraan: typeName,
          nama_type_kendaraan_eri: typeNameEri,
          id_jenis_kendaraan: jenisKendaraanId,
          id_merk_kendaraan: merkKendaraanId,
          kode_negara_asal: kodeNegara,
        });
      }
    }

    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    for (const seed of seeds) {
      console.log(`Seeding type ${seed.nama_type_kendaraan}...`);
      const docRef = collectionRef.doc();

      const verifyType = typeSchema.safeParse(seed);
      if (verifyType.success) {
        batch.set(docRef, {
          ...seed,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    await batch.commit();
    console.log(`Seeding ${collectionName} finished!`);

    res.status(200).send({
      success: true,
      message: "Type kendaraan seeded successfully",
    });
  } catch (error) {
    console.log("Error seeding type kendaraan", error.message);
    res.status(500).send({
      success: false,
      message: "Error seeding type kendaraan",
      error: error.message,
    });
  }
};

exports.kendaraanSeed = async (req, res) => {
  const collectionName = "Kendaraan";
  const seeds = [];

  try {
    const jenisKendaraan = await db.collection("JenisKendaraan").get();
    const jenisKendaraanIds = jenisKendaraan.docs.map((doc) => doc.data().id);
    const merkKendaraan = await db.collection("MerkKendaraan").get();
    const merkKendaraanIds = merkKendaraan.docs.map((doc) => doc.data().id);
    const typeKendaraan = await db.collection("TypeKendaraan").get();
    const typeKendaraanIds = typeKendaraan.docs.map((doc) => doc.data().id);

    while (seeds.length < 10) {
      const id_jenis_kendaraan = faker.helpers.arrayElement(jenisKendaraanIds);
      const id_merk_kendaraan = faker.helpers.arrayElement(merkKendaraanIds);
      const id_type_kendaraan = faker.helpers.arrayElement(typeKendaraanIds);

      const tgl_faktur_kwitansi = faker.date.recent();
      const tgl_stnk = faker.date.recent();
      const tgl_jth_tempo = faker.date.recent();
      const kendaraan = {
        no_daftar: faker.string.numeric(10),
        no_daftar_eri: faker.string.numeric(10),
        id_kepemilikan: faker.string.numeric(16),
        no_kk: faker.string.numeric(16),
        no_polisi: faker.vehicle.vrm(),
        no_polisi_lama: faker.vehicle.vrm(),
        nama_pemilik: faker.person.fullName(),
        nama_pemilik_lama: faker.person.fullName(),
        alamat1: faker.location.streetAddress(),
        alamat2: faker.location.streetAddress(),
        id_kelurahan: faker.string.numeric(10),
        no_telp: faker.phone.number(),
        id_jenis_kendaraan: id_jenis_kendaraan,
        id_merk_kendaraan: id_merk_kendaraan,
        id_type_kendaraan: id_type_kendaraan,
        id_model_kendaraan: id_jenis_kendaraan + id_merk_kendaraan + id_type_kendaraan,
        // id_jenis_map: faker.random.uuid(),
        tahun_buat: faker.number.int({ min: 1980, max: 2021 }),
        tahun_rakit: faker.number.int({ min: 1980, max: 2021 }),
        tahun_ub: faker.number.int({ min: 1980, max: 2021 }),
        cylinder: faker.number.int({ min: 1000, max: 5000 }),
        // id_golongan_kendaraan: faker.random.uuid(),
        // id_warna_tnkb: faker.datatype.number(),
        warna_kendaraan: faker.vehicle.color(),
        // id_lokasi: faker.random.uuid(),
        // dati2_induk: faker.random.word(),
        // id_fungsi_kendaraan: faker.datatype.number(),
        // id_bahan_bakar: faker.datatype.number(),
        no_rangka: faker.vehicle.vin(),
        no_mesin: faker.vehicle.vin(),
        no_bpkb: faker.vehicle.vrm(),
        jumlah_sumbu: faker.number.int({ min: 2, max: 5 }),
        // kode_jenis: faker.random.word(),
        status_blokir: faker.datatype.boolean(),
        progresif: faker.number.int(),
        progresif_tarif: faker.number.int(),
        // id_pendaftaran: faker.random.uuid(),
        // id_lokasi_proses: faker.random.uuid(),
        // dati2_proses: faker.random.word(),
        // tujuan_mutasi: faker.random.word(),
        tanggal_faktur: tgl_faktur_kwitansi,
        tanggal_kwitansi: tgl_faktur_kwitansi,
        tanggal_akhir_stnk: addYearsToDate(tgl_stnk, 5),
        tanggal_akhir_stnk_lama: tgl_stnk,
        tanggal_jatuh_tempo: addYearsToDate(tgl_jth_tempo, 1),
        tanggal_jatuh_tempo_lama: tgl_jth_tempo,
        // id_status: faker.random.uuid(),
        bb1_pokok: convertUSDToIDR(faker.finance.amount({ min: 10, max: 15, dec: 2 })),
        bb1_denda: convertUSDToIDR(faker.finance.amount({ min: 0, max: 5, dec: 2 })),
        pkb_pokok: convertUSDToIDR(faker.finance.amount({ min: 10, max: 15, dec: 2 })),
        pkb_denda: convertUSDToIDR(faker.finance.amount({ min: 0, max: 5, dec: 2 })),
        pkb_bunga: convertUSDToIDR(faker.finance.amount({ min: 0, max: 5, dec: 2 })),
        swdkllj_pokok: convertUSDToIDR(faker.finance.amount({ min: 10, max: 15, dec: 2 })),
        swdkllj_denda: convertUSDToIDR(faker.finance.amount({ min: 0, max: 5, dec: 2 })),
        stnk: convertUSDToIDR(faker.finance.amount({ min: 10, max: 15, dec: 2 })),
        no_skpd: faker.string.numeric(10),
        no_kohir: faker.string.alphanumeric(15),
        no_skum: faker.string.alphanumeric(15),
        // tanggal_daftar: faker.date.past(),
        // tanggal_daftar: faker.date.past(),
        tahun_berlaku: faker.number.int({ min: 2023, max: 2025 }),
        tanggal_max_bayar_pkb: faker.date.future(),
        tanggal_max_bayar_swdkllj: faker.date.future(),
        // kode_pembayaran: faker.random.alphanumeric(10),
        // dpwkp: faker.datatype.number(),
        // ket_dpwkp: faker.random.word(),
        // tanggal_jatuh_tempo_dpwkp: faker.date.future(),
        subsidi: faker.datatype.boolean(),
        njkb: convertUSDToIDR(faker.finance.amount({ min: 20, max: 50 })),
      };

      seeds.push(kendaraan);
    }

    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    for (const seed of seeds) {
      console.log(`Seeding kendaraan ${seed.id_kepemilikan}...`);
      const docRef = collectionRef.doc();

      const kendaraan = {
        id: docRef.id,
        ...seed,
      };

      const verifyKendaraan = kendaraanSchema.safeParse(kendaraan);

      if (!verifyKendaraan.success) throw new Error(verifyKendaraan.error);

      if (verifyKendaraan.success) {
        batch.set(docRef, {
          ...seed,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await batch.commit();
    console.log(`Seeding ${collectionName} finished!`);

    res.status(200).send({
      success: true,
      message: "Kendaraan seeded successfully",
    });
  } catch (error) {
    console.log("Error seeding kendaraan", error.message);
    res.status(500).send({
      success: false,
      message: "Error seeding kendaraan",
      error: error.message,
    });
  }
};

exports.tagihanPajakSeed = async (req, res) => {
  try {
    const kendaraans = await db.collection("Kendaraan").get();
    const batch = db.batch();

    kendaraans.docs.forEach((doc) => {
      const kendaraan = doc.data();
      const tagihanPajak = {
        id_kendaraan: doc.id,
        id_user: kendaraan.id_user,
        jumlah_tagihan: faker.commerce.price({
          symbol: "Rp ",
        }),
        tanggal_terbit: new Date().toISOString(),
        tanggal_jatuh_tempo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "belum lunas",
      };

      const docRef = db.collection("TagihanPajak").doc();
      batch.set(docRef, tagihanPajak);

      // Update kendaraan dengan ID tagihan pajak
      const kendaraanRef = db.collection("Kendaraan").doc(doc.id);
      batch.update(kendaraanRef, {
        tagihan_pajak_ids: admin.firestore.FieldValue.arrayUnion(docRef.id),
        updatedAt: new Date().toISOString(),
      });

      // Update user dengan ID tagihan pajak
      const userRef = db.collection("Users").doc(kendaraan.id_user);
      batch.update(userRef, {
        tagihan_pajak_ids: admin.firestore.FieldValue.arrayUnion(docRef.id),
        updatedAt: new Date().toISOString(),
      });
    });

    await batch.commit();
    res.status(200).send({
      success: true,
      message: "Tagihan pajak per kendaraan generated and updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error generating and updating tagihan pajak per kendaraan",
      error: error.message,
    });
  }
};

// exports.tagihanPajakSeed = async (req, res) => {
//   try {
//     const collectionName = "TagihanPajak";
//     const kendaraans = await db.collection("Kendaraan").get();
//     const kendaraanIds = kendaraans.docs.map((doc) => doc.id);
//     const users = await db.collection("Users").get();
//     const userIds = users.docs.map((doc) => doc.id);

//     const tagihanPajaks = Array.from({ length: 10 }, () => {
//       const kendaraanId = faker.helpers.arrayElement(kendaraanIds);
//       const userId = faker.helpers.arrayElement(userIds);

//       return {
//         id_kendaraan: kendaraanId,
//         id_user: userId,
//         jumlah_tagihan: faker.commerce.price({
//           symbol: "Rp ",
//         }),
//         tanggal_terbit: faker.date.past({ refDate: "2024-01-29T09:52:22.084Z" }),
//         tanggal_jatuh_tempo: faker.date.future({ refDate: "2024-01-29T09:52:22.084Z" }),
//         status: faker.helpers.arrayElement(["lunas", "belum lunas"]),
//       };
//     });

//     console.log(`Seeding ${collectionName}...`);
//     const collectionRef = db.collection(collectionName);
//     const batch = db.batch();

//     for (const object of tagihanPajaks) {
//       console.log(`Seeding tagihan pajak ${object.id_kendaraan}...`);
//       const docRef = collectionRef.doc();
//       const kendaraanRef = db.collection("Kendaraan").doc(object.id_kendaraan);
//       const userRef = db.collection("Users").doc(object.id_user);

//       const newTagihanPajak = {
//         id: docRef.id,
//         ...object,
//       };

//       const verifyTagihanPajak = tagihanPajakSchema.safeParse(newTagihanPajak);
//       if (!verifyTagihanPajak.success) throw new Error(verifyTagihanPajak.error);
//       if (verifyTagihanPajak.success) {
//         batch.set(docRef, {
//           ...verifyTagihanPajak.data,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         });

//         batch.update(kendaraanRef, {
//           tagihan_pajaks: admin.firestore.FieldValue.arrayUnion(docRef.id),
//           updatedAt: new Date().toISOString(),
//         });

//         batch.update(userRef, {
//           tagihan_pajaks: admin.firestore.FieldValue.arrayUnion(docRef.id),
//           updatedAt: new Date().toISOString(),
//         });
//       }
//     }

//     await batch.commit();
//     console.log(`Seeding ${collectionName} finished!`);

//     res.status(200).send({
//       success: true,
//       message: "Tagihan pajak seeded successfully",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error seeding tagihan pajak",
//       error: error.message,
//     });
//   }
// };

// exports.userSeed = async (req, res) => {
//   try {
//     const collectionName = "Users";
//     const users = Array.from({ length: 10 }, () => {
//       return {
//         email: faker.internet.email(),
//         nama: faker.person.fullName(),
//         nik: faker.string.numeric((length = 16)),
//         alamat: faker.location.streetAddress(),
//       };
//     });

//     console.log(`Seeding ${collectionName}...`);
//     const collectionRef = db.collection(collectionName);
//     const batch = db.batch();

//     for (const object of users) {
//       console.log(`Seeding user ${object.nama}...`);
//       const docRef = collectionRef.doc();

//       const newUser = {
//         id: docRef.id,
//         ...object,
//       };

//       const verifyUser = userSchema.safeParse(newUser);
//       if (verifyUser.success) {
//         batch.set(docRef, {
//           ...verifyUser.data,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         });
//       }
//     }

//     await batch.commit();
//     console.log(`Seeding ${collectionName} finished!`);

//     res.status(200).send({
//       success: true,
//       message: "User seeded successfully",
//     });
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error seeding user",
//       error: error.message,
//     });
//   }
// };
