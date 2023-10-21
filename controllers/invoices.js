const Invoices = require("../models/invoices");
const Users = require("../models/users");
const Products = require("../models/products");
const { isEmpty, assign, map } = require("lodash");

class Invoice {
  static async createInvoice(req, res) {
    const { product, customerData } = req.body;
    console.log("[Create Invoice]", product, customerData);
    try {
      const createdInvoice = await Invoices.create({
        product,
        customerData,
      });

      const invoiceId = createdInvoice.insertedId;
      await Users.pushNotification(invoiceId);

      res
        .status(201)
        .json({ status: true, message: `Invoice berhasil ditambahkan` });
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  }

  static async fetchInvoices(req, res) {
    const { name, isPaid, order } = req.body;
    console.log("[Fetch All Invoices]", name, isPaid, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(name)) assign(payload, { name });
      if (!isEmpty(isPaid)) assign(payload, { isPaid });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { "customerData.name": order[0].dir };
      }

      const invoices = await Invoices.findAll(payload, searchOrder);

      if (isEmpty(invoices))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak tersedia",
        };

      for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i];
        let totalPrice = 0;

        for (let j = 0; j < invoice.product.length; j++) {
          const o = invoice.product[j];
          const productDetail = await Products.findByPk(o.productId);

          o.productDetail = {
            name: productDetail.name,
          };

          o.subtotalPrice =
            o.total * (productDetail.price - productDetail.discount);
          totalPrice = totalPrice + o.subtotalPrice;
        }
        invoice.totalPrice = totalPrice;
        invoice.totalPriceAfterDiscount = totalPrice - invoice.discount;
      }

      res.status(200).json({ status: true, invoices });
    } catch (error) {
      console.log(error);
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      }
    }
  }

  static async findInvoice(req, res) {
    const { id } = req.params;
    try {
      const invoice = await Invoices.findByPk(id);

      if (isEmpty(invoice))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak tersedia",
        };

      let totalPrice = 0;

      for (let j = 0; j < invoice.product.length; j++) {
        const o = invoice.product[j];
        const productDetail = await Products.findByPk(o.productId);

        o.productDetail = {
          name: productDetail.name,
        };

        o.subtotalPrice =
          o.total * (productDetail.price - productDetail.discount);
        totalPrice = totalPrice + o.subtotalPrice;
      }
      invoice.totalPrice = totalPrice;
      invoice.totalPriceAfterDiscount = totalPrice - invoice.discount;

      res.status(200).json({ status: true, invoice });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      }
    }
  }

  static async updateInvoice(req, res) {
    const { id } = req.params;
    const { product, customerData, discount, isPaid } = req.body;
    console.log(
      "[Update Invoice]",
      id,
      product,
      customerData,
      discount,
      isPaid
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(product)) assign(payload, { product });
      if (!isEmpty(customerData)) assign(payload, { customerData });
      if (!isEmpty(discount)) assign(payload, { discount: +discount });
      if (!isEmpty(isPaid)) assign(payload, { isPaid: +isPaid });

      //check if the invoice exist or not
      const targetInvoice = await Invoices.findByPk(id);

      if (isEmpty(targetInvoice))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak ditemukan",
        };

      await Invoices.update(id, payload);

      res
        .status(201)
        .json({ status: true, message: `Invoice berhasil diupdate` });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      }
    }
  }

  static async deleteInvoice(req, res) {
    const { id } = req.params;
    try {
      const targetInvoice = await Invoices.findByPk(id);

      if (isEmpty(targetInvoice))
        throw {
          status: false,
          error: "Bad Request",
          message: "Invoice tidak ditemukan",
        };

      await Invoices.destroy(id);

      res
        .status(200)
        .json({
          status: true,
          message: `Invoice dengan id ${id} berhasil dihapus`,
        });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      }
    }
  }
}

module.exports = Invoice;
