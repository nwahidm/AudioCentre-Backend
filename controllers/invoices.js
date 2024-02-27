const Invoices = require("../models/invoices");
const { isEmpty, assign, map } = require("lodash");
const Orders = require("../models/orders");
const Users = require("../models/users");
const moment = require("moment");

class Invoice {
  static async createInvoice(req, res) {
    const { orderId } = req.body;
    const user_id = req.user._id;
    console.log("[Create Invoice]", orderId);
    try {
      await Invoices.create({
        orderId,
        user_id,
      });

      res.status(201).json({
        status: true,
        message: `Invoice berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchInvoices(req, res) {
    const { user_id, isPaid, startDate, endDate, limit, offset } = req.body;
    console.log("[Fetch All Invoices]", user_id, isPaid, limit, offset);
    try {
      //search query
      const payload = {};
      if (!isEmpty(isPaid)) assign(payload, { isPaid });
      if (!isEmpty(user_id)) assign(payload, { user_id });
      if (!isEmpty(startDate)) assign(payload, { startDate });
      if (!isEmpty(endDate)) assign(payload, { endDate });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      const invoices = await Invoices.findAll(payload);

      if (isEmpty(invoices))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak tersedia",
          result: "",
        };

      for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i];

        let id = invoice.orderId;
        const orderDetail = await Orders.findByPk(id);
        invoice.orderDetail = orderDetail;

        let totalPrice = 0;

        for (let j = 0; j < invoice.orderDetail.product.length; j++) {
          invoice.salesman = await Users.findByPk(invoice.user_id);
          if (invoice.salesman) {
            delete invoice.salesman.notification;
            delete invoice.salesman.password;
            delete invoice.salesman.address;
          }

          const o = invoice.orderDetail.product[j];

          o.subtotalPrice = o.total * o.price;
          totalPrice = totalPrice + o.subtotalPrice;
        }
        invoice.orderDetail.totalPrice = totalPrice;
        invoice.orderDetail.fixPrice =
          totalPrice +
          invoice.orderDetail.shipping -
          invoice.orderDetail.discount;
      }

      res
        .status(200)
        .json({ status: true, message: "success", result: invoices });
    } catch (error) {
      console.log(error);
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

  static async findInvoice(req, res) {
    const { id } = req.params;
    console.log("[Fetch Invoice Order]", id);
    try {
      const invoice = await Invoices.findByPk(id);

      if (isEmpty(invoice))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak tersedia",
          result: "",
        };

      invoice.salesman = await Users.findByPk(invoice.user_id);
      delete invoice.salesman.notification;
      delete invoice.salesman.password;
      delete invoice.salesman.address;

      const orderDetail = await Orders.findByPk(invoice.orderId);
      invoice.orderDetail = orderDetail;

      let totalPrice = 0;

      for (let j = 0; j < invoice.orderDetail.product.length; j++) {
        const o = invoice.orderDetail.product[j];

        o.subtotalPrice = o.total * o.price;
        totalPrice = totalPrice + o.subtotalPrice;
      }
      invoice.orderDetail.totalPrice = totalPrice;

      invoice.orderDetail.fixPrice =
        totalPrice +
        invoice.orderDetail.shipping -
        invoice.orderDetail.discount;
      res
        .status(200)
        .json({ status: true, message: "success", result: invoice });
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

  static async updateInvoice(req, res) {
    const { id } = req.params;
    const { isPaid, paymentDate, paymentMethod, bank, accountName } = req.body;
    let paymentProof;
    if (req.files) {
      paymentProof = req.files.images;
    }
    console.log(
      "[Update Order]",
      id,
      isPaid,
      paymentDate,
      paymentMethod,
      paymentProof,
      bank,
      accountName
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(isPaid)) assign(payload, { isPaid: +isPaid });
      if (!isEmpty(paymentDate))
        assign(payload, { paymentDate: moment(paymentDate).format() });
      if (!isEmpty(paymentProof))
        assign(payload, { paymentProof: paymentProof[0].path });
      if (!isEmpty(paymentMethod)) assign(payload, { paymentMethod });
      if (!isEmpty(bank)) assign(payload, { bank });
      if (!isEmpty(accountName)) assign(payload, { accountName });

      //check if the invoice exist or not
      const targetInvoice = await Invoices.findByPk(id);

      if (isEmpty(targetInvoice))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak ditemukan",
          result: "",
        };

      await Invoices.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Invoice berhasil diupdate`,
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

  static async deleteInvoice(req, res) {
    const { id } = req.params;
    console.log("[Delete Invoice]", id);
    try {
      const targetInvoice = await Invoices.findByPk(id);

      if (isEmpty(targetInvoice))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak ditemukan",
          result: "",
        };

      await Invoices.destroy(id);

      res.status(200).json({
        status: true,
        message: `Invoice dengan id ${id} berhasil dihapus`,
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

module.exports = Invoice;
