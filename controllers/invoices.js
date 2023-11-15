const Invoices = require("../models/invoices");
const { isEmpty, assign, map } = require("lodash");
const Orders = require("../models/orders");

class Invoice {
  static async createInvoice(req, res) {
    const { orderId } = req.body;
    console.log("[Create Invoice]", orderId);
    try {
      await Invoices.create({
        orderId,
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
    const { isPaid } = req.body;
    console.log("[Fetch All Invoices]", isPaid);
    try {
      //search query
      const payload = {};
      if (!isEmpty(isPaid)) assign(payload, { isPaid });

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
          const o = invoice.orderDetail.product[j];

          o.subtotalPrice = o.total * o.price;
          totalPrice = totalPrice + o.subtotalPrice;
        }
        invoice.orderDetail.totalPrice = totalPrice;
        invoice.orderDetail.totalPriceAfterDiscount =
          totalPrice - invoice.orderDetail.discount;
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

      const orderDetail = await Orders.findByPk(invoice.orderId);
      invoice.orderDetail = orderDetail;

      let totalPrice = 0;

      for (let j = 0; j < invoice.orderDetail.product.length; j++) {
        const o = invoice.orderDetail.product[j];

        o.subtotalPrice = o.total * o.price;
        totalPrice = totalPrice + o.subtotalPrice;
      }
      invoice.orderDetail.totalPrice = totalPrice;
      invoice.orderDetail.totalPriceAfterDiscount =
        totalPrice - invoice.orderDetail.discount;

      res
        .status(200)
        .json({ status: true, message: "success", result: invoice });
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

  static async updateInvoice(req, res) {
    const { id } = req.params;
    const { isPaid } = req.body;
    console.log("[Update Order]", id, isPaid);
    try {
      //update data
      const payload = {};
      if (!isEmpty(isPaid)) assign(payload, { isPaid: +isPaid });

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
