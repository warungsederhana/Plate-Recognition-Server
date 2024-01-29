const { faker } = require("@faker-js/faker");
const kendaraanSchema = require("../Schemas/kendaraan.schema");
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
