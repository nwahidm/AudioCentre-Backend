const Invoices = require("../models/invoices");
const Orders = require("../models/orders");
const Traffics = require("../models/traffics");
const Users = require("../models/users");
const Customers = require("../models/customers");
const Products = require("../models/products");
const Articles = require("../models/articles");
const url = "https://backend.audiocentre.co.id";
const moment = require("moment");
const { map } = require("lodash");

class Dashboard {
  static async fetchRecapitulation(req, res) {
    console.log("[Dashboard Recapitulation]");
    try {
      //Recap earnings
      const payloadEarnings = {
        isPaid: "1",
      };

      const invoices = await Invoices.findAll(payloadEarnings);

      let earnings = 0;

      for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i];

        let id = invoice.orderId;
        const orderDetail = await Orders.findByPk(id);
        invoice.orderDetail = orderDetail;

        let totalPrice = 0;

        for (let j = 0; j < invoice.orderDetail.product.length; j++) {
          invoice.salesman = await Users.findByPk(invoice.user_id);
          delete invoice.salesman.notification;
          delete invoice.salesman.password;
          delete invoice.salesman.address;

          const o = invoice.orderDetail.product[j];

          o.subtotalPrice = o.total * o.price;
          totalPrice = totalPrice + o.subtotalPrice;
        }
        invoice.orderDetail.totalPrice = totalPrice;
        invoice.orderDetail.fixPrice =
          totalPrice +
          invoice.orderDetail.shipping -
          invoice.orderDetail.discount;

        earnings = earnings + invoice.orderDetail.fixPrice;
      }

      //Recap order
      const payloadTotalOrders = {
        noOrder: null,
      };
      const allOrder = await Orders.findAll(payloadTotalOrders);
      const totalOrder = allOrder.length;

      //Recap Customer
      const customerPayload = {};

      const customers = await Customers.findAll(customerPayload);
      const totalCustomers = customers.length;

      //Recap Traffic
      const trafficPayload = {
        product_id: null,
      };
      const searchOrder = { createAt: -1 };
      const allTraffic = await Traffics.findAll(trafficPayload, searchOrder);
      const totalTraffic = allTraffic.length;

      res.status(200).json({
        status: true,
        message: "success",
        result: {
          earnings,
          totalOrder,
          totalCustomers,
          totalTraffic,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        result: "",
      });
    }
  }

  static async fetchRecentOrder(req, res) {
    try {
      const payloadOrders = {
        noOrder: null,
        limit: 5,
      };
      const searchOrders = {
        createdAt: -1,
      };
      const orders = await Orders.findAll(payloadOrders, searchOrders);

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

      res.status(200).json({
        status: true,
        message: "success",
        result: orders,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        result: "",
      });
    }
  }

  static async fetchAll(req, res) {
    try {
      //Recap earnings
      const payloadEarnings = {
        isPaid: "1",
      };

      const invoices = await Invoices.findAll(payloadEarnings);

      let earnings = 0;

      for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i];

        let id = invoice.orderId;
        const orderDetail = await Orders.findByPk(id);
        invoice.orderDetail = orderDetail;

        let totalPrice = 0;

        for (let j = 0; j < invoice.orderDetail.product.length; j++) {
          invoice.salesman = await Users.findByPk(invoice.user_id);
          delete invoice.salesman.notification;
          delete invoice.salesman.password;
          delete invoice.salesman.address;

          const o = invoice.orderDetail.product[j];

          o.subtotalPrice = o.total * o.price;
          totalPrice = totalPrice + o.subtotalPrice;
        }
        invoice.orderDetail.totalPrice = totalPrice;
        invoice.orderDetail.fixPrice =
          totalPrice +
          invoice.orderDetail.shipping -
          invoice.orderDetail.discount;

        earnings = earnings + invoice.orderDetail.fixPrice;
      }

      //Recap order
      const payloadTotalOrders = {
        noOrder: null,
      };
      const allOrder = await Orders.findAll(payloadTotalOrders);
      const totalOrder = allOrder.length;

      //Recap Product
      // const customerPayload = {};

      // const customers = await Customers.findAll(customerPayload);
      // const totalCustomers = customers.length;

      let totalPayload = {};
      const totalProduct = await Products.count(totalPayload);

      //Recap Traffic
      const trafficPayload = {
        product_id: null,
      };
      const searchOrder = { createAt: -1 };
      const allTraffic = await Traffics.findAll(trafficPayload, searchOrder);
      const totalTraffic = allTraffic.length;

      //order
      const payloadOrders = {
        noOrder: null,
        limit: 10,
      };
      const searchOrders = {
        createdAt: -1,
      };
      const ordersData = await Orders.findAll(payloadOrders, searchOrders);

      for (let i = 0; i < ordersData.length; i++) {
        const order = ordersData[i];
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

      //invoice
      const payloadInvoices = {
        limit: 10,
      };

      const invoicesData = await Invoices.findAll(payloadInvoices, searchOrder);

      for (let i = 0; i < invoicesData.length; i++) {
        const invoice = invoicesData[i];

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

      //article
      const payloadArticle = {
        limit: 5,
      };
      const articleOrder = { createdAt: 1 };

      const articlesData = await Articles.findAll(payloadArticle, articleOrder);

      map(articlesData, (o) => {
        o.createdAt = moment(o.createdAt).format("MMMM Do YYYY, h:mm:ss a");
        o.articleImage = `${url}/${o.articleImage}`;
      });

      res.status(200).json({
        status: true,
        message: "success",
        result: {
          earnings,
          totalOrder,
          totalProduct,
          totalTraffic,
          ordersData,
          invoicesData,
          articlesData,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        result: "",
      });
    }
  }
}

module.exports = Dashboard;
