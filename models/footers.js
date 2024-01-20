const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Footers {
  static footersModel() {
    return getDB().collection("footers");
  }

  static async create({
    description,
    location,
    email,
    phoneNumber,
    cellNumber,
    logo1,
    link1,
    logo2,
    link2,
    logo3,
    link3,
    logo4,
    link4,
    logo5,
    link5,
  }) {
    const newfooters = await this.footersModel().insertOne({
      description,
      location,
      email: JSON.parse(email),
      phoneNumber: JSON.parse(phoneNumber),
      cellNumber: JSON.parse(cellNumber),
      logo1: logo1? logo1[0].path : null,
      link1,
      logo2: logo2? logo2[0].path : null,
      link2,
      logo3: logo3? logo3[0].path : null,
      link3,
      logo4: logo4? logo4[0].path : null,
      link4,
      logo5: logo5? logo5[0].path : null,
      link5,
    });
    return newfooters;
  }

  static async findAll() {
    return await this.footersModel().find().toArray();
  }

  static async findOne({ email }) {
    return await this.footersModel().findOne({ email });
  }

  static async findByPk(id) {
    return await this.footersModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.footersModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.footersModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Footers;
