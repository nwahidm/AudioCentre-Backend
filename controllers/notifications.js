const { isEmpty } = require("lodash");
const moment = require("moment");
const Users = require("../models/users");

class Notification {
  static async fetchNotifications(req, res) {
    const { startDate, endDate } = req.body;
    const { _id } = req.user;
    const id = _id;
    try {
      const targetUser = await Users.findByPk(id);

      let data = targetUser.notification;

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Notification tidak ditemukan",
          result: "",
        };

      let notification;
      if (!isEmpty(startDate && endDate)) {
        const newStartDate = moment(startDate).startOf("day").format();
        const newEndDate = moment(endDate).endOf("day").format();
        
        notification = data.filter((o) => {
          return o.createdAt >= newStartDate && o.createdAt <= newEndDate;
        });
      } else {
        notification = data;
      }

      notification.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      res
        .status(200)
        .json({ status: true, message: "success", result: notification });
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

module.exports = Notification;
