const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Users {
  static userModel() {
    return getDB().collection("users");
  }

  static async create({ username, email, password, phoneNumber, address }) {
    const newUser = await this.userModel().insertOne({
      username,
      email,
      password,
      phoneNumber,
      address,
      enabled: false,
    });
    return newUser;
  }

  static async findAll() {
    return await this.userModel().find().toArray();
  }

  static async findOne({ username }) {
    return await this.userModel().findOne({ username });
  }

  static async findByPk(id) {
    const data = await this.userModel().findOne({ _id: new ObjectId(`${id}`) });
    return data;
  }

  static async update(id) {
    return await this.userModel().updateOne(
      { _id: new ObjectId(id) },
      {$set: { enabled: true }}
    );
  }

  static async destroy(id) {
    return await this.userModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Users;
