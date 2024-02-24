const { assign, isEmpty } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Customers {
  static customersModel() {
    return getDB().collection("customers");
  }

  static async create({ name, email, address, phoneNumber }) {
    const newCustomer = await this.customersModel().insertOne({
      name,
      email,
      address,
      phoneNumber,
    });
    return newCustomer;
  }

  static async findAll(payload, searchOrder) {
    const { name, email, address, phoneNumber, limit, offset } = payload;
    console.log(
      "[ Payload ]",
      name,
      email,
      address,
      phoneNumber,
      limit,
      offset
    );
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(name))
      assign(where, { name: { $regex: name, $options: "i" } });
    if (!isEmpty(email))
      assign(where, { email: { $regex: email, $options: "i" } });
    if (!isEmpty(address))
      assign(where, { address: { $regex: address, $options: "i" } });
    if (!isEmpty(phoneNumber))
      assign(where, { phoneNumber: { $regex: phoneNumber, $options: "i" } });

    return await this.customersModel()
      .find(where)
      .sort(searchOrder)
      .skip(+offset)
      .limit(+limit)
      .toArray();
  }

  static async findOne({ email }) {
    return await this.customersModel().findOne({ email });
  }

  static async findByPk(id) {
    return await this.customersModel().findOne({ _id: new ObjectId(`${id}`) });
  }

  static async update(id, payload) {
    return await this.customersModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.customersModel().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Customers;
