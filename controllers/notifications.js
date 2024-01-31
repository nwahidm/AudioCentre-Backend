const { isEmpty } = require("lodash");
const Users = require("../models/users");

class Notification {
  static async fetchNotifications(req, res) {
    const { _id } = req.user;
    const id = _id;
    try {
      const targetUser = await Users.findByPk(id);

      const notification = targetUser.notification;

      if (isEmpty(notification))
        throw {
          status: false,
          error: "Bad Request",
          message: "Notification tidak ditemukan",
          result: "",
        };

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
