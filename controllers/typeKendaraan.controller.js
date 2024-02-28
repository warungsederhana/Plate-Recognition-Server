const typeKendaraanSchema = require("../Schemas/typeKendaraan.schema");
const admin = require("../lib/firebase/admin");
const {
  updateTimestampsInObject,
  convertStringsToDateObjects,
} = require("../utils/converter.util");
const db = admin.firestore();

exports.getAllTypeKendaraan = async (req, res) => {};

exports.createTypeKendaraan = async (req, res) => {};

exports.getTypeKendaraanById = async (req, res) => {};

exports.updateTypeKendaraan = async (req, res) => {};

exports.deleteTypeKendaraan = async (req, res) => {};
