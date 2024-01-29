const { faker } = require("@faker-js/faker");
const kendaraanSchema = require("../Schemas/kendaraan.schema");
const tagihanPajakSchema = require("../Schemas/tagihanPajak.schema");
const admin = require("../lib/firebase/admin");
const db = admin.firestore();

exports.kendaraanSeed = async (req, res) => {
  try {
    const collectionName = "Kendaraan";
    const users = await db.collection("Users").get();
    const userIds = users.docs.map((doc) => doc.id);

    const kendaraans = Array.from({ length: 10 }, () => {
      const userId = faker.helpers.arrayElement(userIds);
      const user = users.docs.find((doc) => doc.id === userId);

      return {
        id_user: userId,
        nama: faker.vehicle.vehicle(),
        nama_pemilik: user.data().nama,
        nama_pemilik_lama: faker.person.fullName(),
        jenis: faker.vehicle.model(),
        tipe: faker.vehicle.type(),
        nomor_rangka: faker.vehicle.vin(),
        nomor_mesin: faker.vehicle.vin(),
        nomor_bpkb: faker.vehicle.vin(),
        nomor_polisi: faker.vehicle.vrm(),
        warna: faker.vehicle.color(),
        tahun_pembuatan: faker.date.past().getFullYear(),
        bahan_bakar: faker.vehicle.fuel(),
      };
    });

    console.log(`Seeding ${collectionName}...`);
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    for (const object of kendaraans) {
      console.log(`Seeding kendaraan ${object.nama}...`);
      const docRef = collectionRef.doc();
      const userRef = db.collection("Users").doc(object.id_user);

      const newKendaraan = {
        id: docRef.id,
        ...object,
      };

      const verifyKendaraan = kendaraanSchema.safeParse(newKendaraan);
      if (verifyKendaraan.success) {
        batch.set(docRef, {
          ...verifyKendaraan.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        batch.update(userRef, {
          kendaraans: admin.firestore.FieldValue.arrayUnion(docRef.id),
          updatedAt: new Date().toISOString(),
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
