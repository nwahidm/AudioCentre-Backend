const Banners = require("../models/banners");
const { isEmpty, assign, map } = require("lodash");
const fs = require("fs");
const url = "https://backend.audiocentre.co.id";

class Banner {
  static async createBanner(req, res) {
    const { index, bannerName, bannerUrl, status } = req.body;
    const bannerCover = req.files.images;
    console.log("[Create Banner]", index, bannerName, bannerCover, status);
    try {
      await Banners.create({
        index,
        bannerName,
        bannerUrl,
        bannerCover: bannerCover[0].path,
        status,
      });

      res.status(201).json({
        status: true,
        message: `Banner berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchBanners(req, res) {
    const { bannerName, status, order, limit, offset } = req.body;
    console.log(
      "[Fetch All Banners]",
      bannerName,
      status,
      order,
      limit,
      offset
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(bannerName)) assign(payload, { bannerName });
      if (!isEmpty(status)) assign(payload, { status });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { index: order[0].dir };
      }

      const banners = await Banners.findAll(payload, searchOrder);

      if (isEmpty(banners))
        throw {
          status: false,
          error: "Bad Request",
          message: "Banner tidak tersedia",
          result: "",
        };

      map(banners, (o) => {
        o.bannerCover = `${url}/${o.bannerCover}`;
      });

      res
        .status(200)
        .json({ status: true, message: "success", result: banners });
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

  static async findBanner(req, res) {
    const { id } = req.params;
    try {
      const data = await Banners.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Banner tidak tersedia",
          result: "",
        };

      const banner = {
        _id: data._id,
        bannerName: data.bannerName,
        bannerCover: data.bannerCover,
        bannerUrl: data.bannerUrl,
        status: data.status,
      };

      banner.bannerCover = `${url}/${banner.bannerCover}`;

      res
        .status(200)
        .json({ status: true, message: "success", result: banner });
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

  static async updateBanner(req, res) {
    const { id } = req.params;
    const { index, bannerName, bannerUrl, status } = req.body;
    let bannerCover;
    if (req.files) {
      bannerCover = req.files.images;
    }
    console.log(
      "[Update Banner]",
      id,
      index,
      bannerName,
      bannerUrl,
      status,
      bannerCover
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(index)) assign(payload, { index });
      if (!isEmpty(bannerName)) assign(payload, { bannerName });
      if (!isEmpty(bannerUrl)) assign(payload, { bannerUrl });
      if (!isEmpty(bannerCover))
        assign(payload, { bannerCover: bannerCover[0].path });
      if (!isEmpty(status)) assign(payload, { status: +status });

      //check if the banner exist or not
      const targetBanner = await Banners.findByPk(id);

      if (isEmpty(targetBanner))
        throw {
          status: false,
          error: "Bad Request",
          message: "Banner tidak ditemukan",
          result: "",
        };

      await Banners.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Banner berhasil diupdate`,
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

  static async deleteBanner(req, res) {
    const { id } = req.params;
    try {
      const targetBanner = await Banners.findByPk(id);

      if (isEmpty(targetBanner))
        throw {
          status: false,
          error: "Bad Request",
          message: "Banner tidak ditemukan",
          result: "",
        };

      fs.unlinkSync(`./${targetBanner.bannerCover}`);

      await Banners.destroy(id);

      res.status(200).json({
        status: true,
        message: `Banner dengan id ${id} berhasil dihapus`,
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

module.exports = Banner;
