const Invoices = require("../models/invoices");
const Orders = require("../models/orders");
const Traffics = require("../models/traffics");
const Users = require("../models/users");
const { isEmpty, assign, map } = require("lodash");

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

      //Recap Traffic
      const trafficPayload = {
        product_id: null
      }
      const searchOrder = { createAt: -1 };
      const allTraffic = await Traffics.findAll(trafficPayload, searchOrder)
      const totalTraffic = allTraffic.length

      res.status(200).json({
        status: true,
        message: "success",
        result: {
          earnings,
          totalOrder,
          totalTraffic
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
        limit: 5
      };
      const searchOrders = {
        "createdAt": -1,
      };
      const orders = await Orders.findAll(payloadOrders, searchOrders);

      res.status(200).json({
        status: true,
        message: "success",
        result: orders
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        result: "",
      });
    }
  }
}

module.exports = Dashboard;
