const Users = require("../models/users");
const { createToken } = require("../helpers/jwt");
const { isEmpty, assign, map } = require("lodash");
const { hashPassword, verifyPassword } = require("../helpers/bcrypt");
const send = require("../helpers/nodemailer");

class User {
  static async register(req, res) {
    const { username, email, password, phoneNumber, address } = req.body;
    console.log(
      "[Register User]",
      username,
      email,
      password,
      phoneNumber,
      address
    );
    try {
      await Users.create({
        username,
        email,
        password: await hashPassword(password),
        phoneNumber,
        address,
      });

      // send(email);

      res.status(201).json({
        status: true,
        message: `Akun anda telah berhasil dibuat, silahkan cek email untuk melakukan aktivasi`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async activate(req, res) {
    const { id } = req.params;
    console.log("[Activate User]", id);
    try {
      const targetUser = await Users.findByPk(id);

      if (isEmpty(targetUser))
        throw {
          status: false,
          error: "Bad Request",
          message: "User tidak ditemukan",
          result: "",
        };

      await Users.update(id);

      res.status(201).json({
        status: true,
        message: `user with ${id} has been activated`,
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

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await Users.findOne({ email });

      if (isEmpty(user))
        throw {
          status: false,
          error: "Bad Request",
          message: "Email atau password salah",
          result: "",
        };

      const isValid = await verifyPassword(password, user.password);

      if (!isValid)
        throw {
          status: false,
          error: "Bad Request",
          message: "Email atau password salah",
          result: "",
        };

      if (user.enabled == false)
        throw {
          status: false,
          error: "Bad Request",
          message:
            "Akun anda belum diaktivasi, silahkan cek email untuk melakukan aktivasi akun",
          result: "",
        };

      const access_token = await createToken(user, process.env.SECRET, {
        expiresIn: "3d",
      });

      delete user.password;
      delete user.notification;

      res.status(200).json({
        status: true,
        message: "success",
        result: { access_token, user },
      });
    } catch (error) {
      if (error.status == false) {
        res.status(401).json(error);
      } else {
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }

  static async fetchUsers(req, res) {
    try {
      const users = await Users.findAll();

      map(users, (o) => {
        delete o.notification;
      });

      res.status(200).json({ status: true, message: "success", result: users });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async findUser(req, res) {
    const { id } = req.params;
    try {
      //check if the user exist or not
      const data = await Users.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "User tidak ditemukan",
          result: "",
        };

      delete data.password;
      delete data.notification;

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

  static async updateUser(req, res) {
    const { id } = req.params;
    const { username, email, password, phoneNumber, address } = req.body;
    console.log(
      "[Update User]",
      id,
      username,
      email,
      password,
      phoneNumber,
      address
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(username)) assign(payload, { username });
      if (!isEmpty(email)) assign(payload, { email });
      if (!isEmpty(password))
        assign(payload, { password: await hashPassword(password) });
      if (!isEmpty(phoneNumber)) assign(payload, { phoneNumber });
      if (!isEmpty(address)) assign(payload, { address });

      //check if the user exist or not
      const targetUser = await Users.findByPk(id);

      if (isEmpty(targetUser))
        throw {
          status: false,
          error: "Bad Request",
          message: "User tidak ditemukan",
          result: "",
        };

      await Users.update(id, payload);

      res
        .status(201)
        .json({ status: true, message: `Update akun berhasil`, result: "" });
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

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const targetUser = await Users.findByPk(id);

      if (isEmpty(targetUser))
        throw {
          status: false,
          error: "Bad Request",
          message: "User tidak ditemukan",
        };

      await Users.destroy(id);

      res.status(200).json({
        status: true,
        message: `User with id ${id} deleted`,
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

module.exports = User;
