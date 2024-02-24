const Customers = require("../models/customers");
const { isEmpty, assign, map } = require("lodash");
const moment = require("moment");

class Customer {
  static async createCustomer(req, res) {
    const { name, email, address, phoneNumber } = req.body;
    console.log("[Create Customer]", name, email, address, phoneNumber);
    try {
      await Customers.create({
        name,
        email,
        address,
        phoneNumber,
      });

      res.status(201).json({
        status: true,
        message: `Customer berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchCustomers(req, res) {
    const { name, email, address, phoneNumber, order, limit, offset } =
      req.body;
    console.log(
      "[Fetch All Customers]",
      name,
      email,
      address,
      phoneNumber,
      order,
      limit,
      offset
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(name)) assign(payload, { name });
      if (!isEmpty(email)) assign(payload, { email });
      if (!isEmpty(address)) assign(payload, { address });
      if (!isEmpty(phoneNumber)) assign(payload, { phoneNumber });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { name: order[0].dir };
      }

      const data = await Customers.findAll(payload, searchOrder);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Customer tidak tersedia",
          result: "",
        };

      res
        .status(200)
        .json({ status: true, message: "success", result: data });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async findCustomer(req, res) {
    const { id } = req.params;
    try {
      const data = await Customers.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Customer tidak tersedia",
          result: "",
        };

      res.status(200).json({ status: true, message: "success", result: data });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async updateCustomer(req, res) {
    const { id } = req.params;
    const { name, email, address, phoneNumber } = req.body;
    console.log(
      "[Update Customer]",
      id,
      name,
      email,
      address,
      phoneNumber,
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(name)) assign(payload, { name });
      if (!isEmpty(email)) assign(payload, { email });
      if (!isEmpty(address)) assign(payload, { address });
      if (!isEmpty(phoneNumber)) assign(payload, { phoneNumber });

      //check if the customer exist or not
      const targetCustomer = await Customers.findByPk(id);

      if (isEmpty(targetCustomer))
        throw {
          status: false,
          error: "Bad Request",
          message: "Customer tidak ditemukan",
          result: "",
        };

      await Customers.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Customer berhasil diupdate`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async deleteCustomer(req, res) {
    const { id } = req.params;
    try {
      const targetCustomer = await Customers.findByPk(id);

      if (isEmpty(targetCustomer))
        throw {
          status: false,
          error: "Bad Request",
          message: "Customer tidak ditemukan",
          result: "",
        };

      await Customers.destroy(id);

      res.status(200).json({
        status: true,
        message: `Customer dengan id ${id} berhasil dihapus`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }
}

module.exports = Customer;
