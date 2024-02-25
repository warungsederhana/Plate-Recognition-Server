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
