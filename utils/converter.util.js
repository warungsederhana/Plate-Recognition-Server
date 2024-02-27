const firebase = require("../lib/firebase/firebase");
const firestore = require("firebase/firestore");

exports.convertUSDToIDR = (usd, exchangeRate = 14500) => {
  return usd * exchangeRate;
};

exports.formatDate = (isoDateString, yearsToAdd = 0) => {
  const date = new Date(isoDateString);
  date.setFullYear(date.getFullYear() + yearsToAdd); // Adding the years

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

exports.convertFirestoreToDate = (timestamp) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

exports.updateTimestampsInObject = (data) => {
  Object.keys(data).forEach((key) => {
    if (data[key] && typeof data[key] === "object") {
      if ("_seconds" in data[key] && "_nanoseconds" in data[key]) {
        // Mengubah timestamp menjadi Date, lalu memformatnya
        data[key] = this.formatDate(this.convertFirestoreToDate(data[key]));
      } else {
        // Jika properti adalah objek tapi bukan timestamp, ulangi proses secara rekursif
        this.updateTimestampsInObject(data[key]);
      }
    }
  });
  return data;
};

/**
 * Converts all date strings in an object to Firestore Timestamps.
 * @param {Object} inputData - The input object containing potential date strings.
 * @return {Object} - The input object with date strings converted to Firestore Timestamps.
 */
exports.convertDatesToFirestoreTimestamps = (inputData) => {
  const dateFields = [
    "tanggal_faktur",
    "tanggal_kwitansi",
    "tanggal_akhir_stnk",
    "tanggal_akhir_stnk_lama",
    "tanggal_jatuh_tempo",
    "tanggal_jatuh_tempo_lama",
    "tanggal_daftar",
    "tanggal_bayar",
    "tanggal_max_bayar_pkb",
    "tanggal_max_bayar_swdkllj",
    "tanggal_jatuh_tempo_dpwkp",
  ]; // Add or remove fields based on your needs

  for (const field of dateFields) {
    if (inputData[field]) {
      // Convert the date string to a Date object
      const parts = inputData[field].split("/");
      const dateObject = new Date(parts[2], parts[1] - 1, parts[0]);

      // Convert the Date object to a Firestore Timestamp
      inputData[field] = firestore.Timestamp.fromDate(dateObject);
    }
  }

  return inputData;
};

exports.convertStringsToDateObjects = (inputObject) => {
  const dateKeys = [
    "tanggal_faktur",
    "tanggal_kwitansi",
    "tanggal_akhir_stnk",
    "tanggal_akhir_stnk_lama",
    "tanggal_jatuh_tempo",
    "tanggal_jatuh_tempo_lama",
    "tanggal_daftar",
    "tanggal_bayar",
    "tanggal_max_bayar_pkb",
    "tanggal_max_bayar_swdkllj",
    "tanggal_jatuh_tempo_dpwkp",
  ];

  // Iterate over the object to find and convert date strings
  Object.keys(inputObject).forEach((key) => {
    if (dateKeys.includes(key) && inputObject[key]) {
      try {
        const parts = inputObject[key].split("/");
        // Convert to Date object and adjust month index (0-based)
        const date = new Date(
          parseInt(parts[2], 10),
          parseInt(parts[1], 10) - 1,
          parseInt(parts[0], 10)
        );
        inputObject[key] = date;
      } catch (error) {
        console.error(`Error converting date for key '${key}':`, error);
        // Handle the error as needed
      }
    }
  });

  return inputObject;
};
