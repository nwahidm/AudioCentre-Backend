const Users = require("../models/users");

class Notification {
  static async fetchNotifications(req, res) {
    const { _id } = req.user;
    const id = _id
    try {
        const targetUser = await Users.findByPk(id)

        const notification = targetUser.notification

        res.status(200).json(notification);
    } catch (error) {
        if (error.status == 404) {
            res.status(404).json(error);
          } else {
            res.status(500).json({ message: "Internal Server Error" });
          } 
    }
  }
}

module.exports = Notification;
