const Footers = require("../models/footers");
const { isEmpty, assign } = require("lodash");
const url = "https://backend.audiocentre.co.id";

class Footer {
  static async createFooter(req, res) {
    const {
      description,
      location,
      email,
      phoneNumber,
      cellNumber,
      link1,
      link2,
      link3,
      link4,
      link5,
    } = req.body;
    let logo1, logo2, logo3, logo4, logo5;

    if (req.files.logo1) {
      logo1 = req.files.logo1;
    }

    if (req.files.logo2) {
      logo2 = req.files.logo2;
    }

    if (req.files.logo3) {
      logo3 = req.files.logo3;
    }

    if (req.files.logo4) {
      logo4 = req.files.logo4;
    }

    if (req.files.logo5) {
      logo5 = req.files.logo5;
    }

    console.log(
      "[Create Footer]",
      description,
      location,
      email,
      phoneNumber,
      cellNumber
    );
    try {
      await Footers.create({
        description,
        location,
        email,
        phoneNumber,
        cellNumber,
        logo1,
        link1,
        logo2,
        link2,
        logo3,
        link3,
        logo4,
        link4,
        logo5,
        link5,
      });

      res.status(201).json({
        status: true,
        message: `Footer berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchFooters(req, res) {
    try {
      const footers = await Footers.findAll();

      if (isEmpty(footers))
        throw {
          status: false,
          error: "Bad Request",
          message: "Footer tidak tersedia",
          result: "",
        };

      for (let i in footers) {
        if (footers[i].logo1) {
          footers[i].logo1 = `${url}/${footers[i].logo1}`;
        }

        if (footers[i].logo2) {
          footers[i].logo2 = `${url}/${footers[i].logo2}`;
        }

        if (footers[i].logo3) {
          footers[i].logo3 = `${url}/${footers[i].logo3}`;
        }

        if (footers[i].logo4) {
          footers[i].logo4 = `${url}/${footers[i].logo4}`;
        }

        if (footers[i].logo5) {
          footers[i].logo5 = `${url}/${footers[i].logo5}`;
        }
      }

      res
        .status(200)
        .json({ status: true, message: "success", result: footers });
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

  static async findFooter(req, res) {
    const { id } = req.params;
    try {
      const data = await Footers.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Footer tidak tersedia",
          result: "",
        };

      if (data.logo1) {
        data.logo1 = `${url}/${data.logo1}`;
      }

      if (data.logo2) {
        data.logo2 = `${url}/${data.logo2}`;
      }

      if (data.logo3) {
        data.logo3 = `${url}/${data.logo3}`;
      }

      if (data.logo4) {
        data.logo4 = `${url}/${data.logo4}`;
      }

      if (data.logo5) {
        data.logo5 = `${url}/${data.logo5}`;
      }

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

  static async updateFooter(req, res) {
    const { id } = req.params;
    const {
      description,
      location,
      email,
      phoneNumber,
      cellNumber,
      link1,
      link2,
      link3,
      link4,
      link5,
    } = req.body;

    let logo1, logo2, logo3, logo4, logo5;

    if (req.files.logo1) {
      logo1 = req.files.logo1;
    }

    if (req.files.logo2) {
      logo2 = req.files.logo2;
    }

    if (req.files.logo3) {
      logo3 = req.files.logo3;
    }

    if (req.files.logo4) {
      logo4 = req.files.logo4;
    }

    if (req.files.logo5) {
      logo5 = req.files.logo5;
    }
    console.log(
      "[Update Footer]",
      id,
      description,
      location,
      email,
      phoneNumber,
      cellNumber
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(description)) assign(payload, { description });
      if (!isEmpty(location)) assign(payload, { location });
      if (!isEmpty(email)) assign(payload, { email: JSON.parse(email) });
      if (!isEmpty(phoneNumber))
        assign(payload, { phoneNumber: JSON.parse(phoneNumber) });
      if (!isEmpty(cellNumber))
        assign(payload, { cellNumber: JSON.parse(cellNumber) });
      if (!isEmpty(logo1)) assign(payload, { logo1: logo1[0].path });
      if (!isEmpty(link1)) assign(payload, { link1 })
      if (!isEmpty(logo2)) assign(payload, { logo2: logo2[0].path });
      if (!isEmpty(link2)) assign(payload, { link2 })
      if (!isEmpty(logo3)) assign(payload, { logo3: logo3[0].path });
      if (!isEmpty(link3)) assign(payload, { link3 })
      if (!isEmpty(logo4)) assign(payload, { logo4: logo4[0].path });
      if (!isEmpty(link4)) assign(payload, { link4 })
      if (!isEmpty(logo5)) assign(payload, { logo5: logo5[0].path });
      if (!isEmpty(link5)) assign(payload, { link5 })

      //check if the footer exist or not
      const targetFooter = await Footers.findByPk(id);

      if (isEmpty(targetFooter))
        throw {
          status: false,
          error: "Bad Request",
          message: "Footer tidak ditemukan",
          result: "",
        };

      await Footers.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Footer berhasil diupdate`,
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

  static async deleteFooter(req, res) {
    const { id } = req.params;
    try {
      const targetFooter = await Footers.findByPk(id);

      if (isEmpty(targetFooter))
        throw {
          status: false,
          error: "Bad Request",
          message: "Footer tidak ditemukan",
          result: "",
        };

      await Footers.destroy(id);

      res.status(200).json({
        status: true,
        message: `Footer dengan id ${id} berhasil dihapus`,
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

module.exports = Footer;
