const Users = require("../models/users");
const { createToken } = require("../helpers/jwt");
const { isEmpty, assign } = require("lodash");
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

      send(email);

      res.status(201).json({
        message: `Akun anda telah berhasil dibuat, silahkan cek email untuk melakukan aktivasi`,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async activate(req, res) {
    const { id } = req.params;
    console.log("[Activate User]", id);
    try {
      const targetUser = await Users.findByPk(id);

      if (isEmpty(targetUser))
        throw {
          status: 404,
          error: "Bad Request",
          message: "User tidak ditemukan",
        };

      await Users.update(id);

      res.status(201).json({ message: `user with ${id} has been activated` });
    } catch (error) {
      console.log(error);
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await Users.findOne({ username });

      if (isEmpty(user))
        throw {
          status: 401,
          error: "Bad Request",
          message: "Username atau password salah",
        };

      const isValid = await verifyPassword(password, user.password);

      if (!isValid)
        throw {
          status: 401,
          error: "Bad Request",
          message: "Username atau password salah",
        };

      if (user.enabled == false)
        throw {
          status: 401,
          error: "Bad Request",
          message:
            "Akun anda belum diaktivasi, silahkan cek email untuk melakukan aktivasi akun",
        };

      const access_token = await createToken(user, process.env.SECRET, {
        expiresIn: "3d",
      });

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      if (error.status == 401) {
        res.status(401).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async fetchUsers(req, res) {
    try {
      const users = await Users.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async findUser(req, res) {
    const { id } = req.params;
    try {
      //check if the user exist or not
      const data = await Users.findByPk(id);

      if (isEmpty(data))
        throw {
          status: 404,
          error: "Bad Request",
          message: "User tidak ditemukan",
        };

      const user = {
        _id: data._id,
        username: data.username,
        email: data.email,
      };

      res.status(200).json(user);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
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
          status: 404,
          error: "Bad Request",
          message: "User tidak ditemukan",
        };

      await Users.update(id, payload);

      res.status(201).json({message: `Update akun berhasil`})
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const targetUser = await Users.findByPk(id);

      if (isEmpty(targetUser))
        throw {
          status: 404,
          error: "Bad Request",
          message: "User tidak ditemukan",
        };

      await Users.destroy(id);

      res.status(200).json({ message: `User with id ${id} deleted` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = User;
