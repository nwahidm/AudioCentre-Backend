const Orders = require("../models/orders");
const Users = require("../models/users");
const Products = require("../models/products");
const { isEmpty, assign, map } = require("lodash");
const moment = require("moment");
const Invoices = require("../models/invoices");
const { ObjectId } = require("mongodb");

class Order {
  static async createOrder(req, res) {
    const { product, customerData, comment } = req.body;
    console.log("[Create Order]", product, customerData);
    try {
      if (!product) {
        throw {
          status: false,
          error: "Bad Request",
          message: "Product is required",
          result: "",
        };
      }

      if (!customerData) {
        throw {
          status: false,
          error: "Bad Request",
          message: "Customer is required",
          result: "",
        };
      }

      let productDetail = {};
      for (let i in product) {
        productDetail = await Products.findByPk(product[i].productId);

        product[i].name = productDetail.name;
        product[i].price = productDetail.price - productDetail.discount;
      }

      const noOrder = `ORD${moment().format("YYYYMMDD")}`;

      const payload = { noOrder };
      const total = await Orders.findAll(payload);

      let fixNoOrder;

      if (total.length < 10) {
        fixNoOrder = `ORD${moment().format("YYYYMMDD")}00${total.length + 1}`;
      } else {
        fixNoOrder = `ORD${moment().format("YYYYMMDD")}0${total.length + 1}`;
      }

      const createdOrder = await Orders.create({
        fixNoOrder,
        product,
        customerData,
        comment,
      });

      const orderId = createdOrder.insertedId;
      await Users.pushNotification(orderId);

      res.status(201).json({
        status: true,
        message: `Order berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(400).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async createOrderBasedOnExistingOrder(req, res) {
    const {
      product,
      customerData,
      referenceId,
      discount,
      shipping,
      comment,
      user_id,
    } = req.body;
    console.log(
      "[Create Order]",
      product,
      customerData,
      referenceId,
      discount,
      shipping,
      comment,
      user_id
    );
    try {
      if (!product) {
        throw {
          status: false,
          error: "Bad Request",
          message: "Product is required",
          result: "",
        };
      }

      if (!customerData) {
        throw {
          status: false,
          error: "Bad Request",
          message: "Customer is required",
          result: "",
        };
      }

      let productDetail = {};
      for (let i in product) {
        productDetail = await Products.findByPk(product[i].productId);

        product[i].name = productDetail.name;
        product[i].price = productDetail.price - productDetail.discount;
      }

      const noOrder = `ORD${moment().format("YYYYMMDD")}`;

      const payload = { noOrder };
      const total = await Orders.findAll(payload);

      let fixNoOrder;

      if (total.length < 10) {
        fixNoOrder = `ORD${moment().format("YYYYMMDD")}00${total.length + 1}`;
      } else {
        fixNoOrder = `ORD${moment().format("YYYYMMDD")}0${total.length + 1}`;
      }

      const createdOrder = await Orders.create({
        fixNoOrder,
        product,
        customerData,
        referenceId,
        discount,
        shipping,
        comment,
        user_id,
      });

      const orderId = createdOrder.insertedId;
      await Users.pushNotification(orderId);

      res.status(201).json({
        status: true,
        message: `Order berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(400).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async fetchOrders(req, res) {
    const { noOrder, status, user_id, referenceId, order } = req.body;
    console.log("[Fetch All Orders]", noOrder, status, user_id, referenceId, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(noOrder)) assign(payload, { noOrder });
      if (!isEmpty(status)) assign(payload, { status });
      if (!isEmpty(user_id)) assign(payload, { user_id });
      if (!isEmpty(referenceId)) assign(payload, { referenceId });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { "customerData.name": order[0].dir };
      }

      const orders = await Orders.findAll(payload, searchOrder);

      if (isEmpty(orders))
        throw {
          status: false,
          error: "Bad Request",
          message: "Order tidak tersedia",
          result: "",
        };

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let totalPrice = 0;

        if (order.user_id) {
          order.salesman = await Users.findByPk(order.user_id);
          delete order.salesman.notification;
          delete order.salesman.password;
          delete order.salesman.address;
        }

        for (let j = 0; j < order.product.length; j++) {
          const o = order.product[j];

          o.subtotalPrice = o.total * o.price;
          totalPrice = totalPrice + o.subtotalPrice;
        }
        order.totalPrice = totalPrice;
        order.fixPrice = totalPrice + order.shipping - order.discount;
      }

      res
        .status(200)
        .json({ status: true, message: "success", result: orders });
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

  static async findOrder(req, res) {
    const { id } = req.params;
    console.log("[Fetch Detail Order]", id);
    try {
      const order = await Orders.findByPk(id);

      if (isEmpty(order))
        throw {
          status: false,
          error: "Bad Request",
          message: "Order tidak tersedia",
          result: "",
        };

      if (order.user_id) {
        order.salesman = await Users.findByPk(order.user_id);
        delete order.salesman.notification;
        delete order.salesman.password;
        delete order.salesman.address;
      }

      let totalPrice = 0;

      for (let j = 0; j < order.product.length; j++) {
        const o = order.product[j];

        o.subtotalPrice = o.total * o.price;
        totalPrice = totalPrice + o.subtotalPrice;
      }
      order.totalPrice = totalPrice;
      order.fixPrice = totalPrice - order.discount;

      res.status(200).json({ status: true, message: "success", result: order });
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

  static async updateOrder(req, res) {
    const { id } = req.params;
    const {
      product,
      customerData,
      shipping,
      discount,
      comment,
      status,
      user_id,
    } = req.body;
    console.log(
      "[Update Order]",
      id,
      product,
      customerData,
      shipping,
      discount,
      comment,
      status,
      user_id
    );
    try {
      let productDetail = {};

      //update data
      const payload = {};
      if (!isEmpty(product)) {
        for (let i in product) {
          productDetail = await Products.findByPk(product[i].productId);

          product[i].name = productDetail.name;
          product[i].price = productDetail.price - productDetail.discount;
        }
        assign(payload, { product });
      }
      if (!isEmpty(customerData)) assign(payload, { customerData });
      if (!isEmpty(shipping)) assign(payload, { shipping: +shipping });
      if (!isEmpty(comment)) assign(payload, { comment });
      if (!isEmpty(discount)) assign(payload, { discount: +discount });
      if (!isEmpty(status)) assign(payload, { status: +status });
      if (!isEmpty(user_id))
        assign(payload, { user_id: new ObjectId(user_id) });

      //check if the order exist or not
      const targetOrder = await Orders.findByPk(id);

      if (isEmpty(targetOrder))
        throw {
          status: false,
          error: "Bad Request",
          message: "Order tidak ditemukan",
          result: "",
        };

      await Orders.update(id, payload);

      if (status == 2) {
        const orderId = targetOrder._id;
        const user_id = targetOrder.user_id;
        await Invoices.create({ orderId, user_id });
      }

      res.status(201).json({
        status: true,
        message: `Order berhasil diupdate`,
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

  static async deleteOrder(req, res) {
    const { id } = req.params;
    console.log("[Delete Order]", id);
    try {
      const targetOrder = await Orders.findByPk(id);

      if (isEmpty(targetOrder))
        throw {
          status: false,
          error: "Bad Request",
          message: "Order tidak ditemukan",
          result: "",
        };

      await Orders.destroy(id);

      res.status(200).json({
        status: true,
        message: `Order dengan id ${id} berhasil dihapus`,
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

module.exports = Order;
