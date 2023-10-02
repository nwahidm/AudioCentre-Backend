const Banners = require("../models/banners");
const { isEmpty, assign } = require("lodash");

class Banner {
  static async createBanner(req, res) {
    const { bannerName, status } = req.body;
    const bannerCover = req.files.images;
    console.log("[Create Banner]", bannerName, bannerCover, status);
    try {
      await Banners.create({
        bannerName,
        bannerCover: bannerCover[0].path,
        status,
      });

      res.status(201).json({ message: `Banner berhasil ditambahkan` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async fetchBanners(req, res) {
    const { bannerName, status, order } = req.body;
    console.log("[Fetch All Banners]", bannerName, status, order);
    try {
      //search query
      const payload = {};
      if (!isEmpty(bannerName)) assign(payload, { bannerName });
      if (!isEmpty(status)) assign(payload, { status });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { bannerName: order[0].dir };
      }

      const banners = await Banners.findAll(payload, searchOrder);

      if (isEmpty(banners))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Banner tidak tersedia",
        };

      res.status(200).json(banners);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async findBanner(req, res) {
    const { id } = req.params;
    try {
      const data = await Banners.findByPk(id);

      if (isEmpty(data))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Banner tidak tersedia",
        };

      const banner = {
        _id: data._id,
        bannerName: data.bannerName,
        bannerCover: data.bannerCover,
        status: data.status,
      };

      res.status(200).json(banner);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async updateBanner(req, res) {
    const { id } = req.params;
    const { bannerName } = req.body;
    console.log("[Update Banner]", id, bannerName);
    try {
      //update data
      const payload = {};
      if (!isEmpty(bannerName)) assign(payload, { bannerName });

      //check if the banner exist or not
      const targetBanner = await Banners.findByPk(id);

      if (isEmpty(targetBanner))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Banner tidak ditemukan",
        };

      await Banners.update(id, payload);

      res.status(201).json({ message: `Banner berhasil diupdate` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteBanner(req, res) {
    const { id } = req.params;
    try {
      const targetBanner = await Banners.findByPk(id);

      if (isEmpty(targetBanner))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Banner tidak ditemukan",
        };

      await Banners.destroy(id);

      res
        .status(200)
        .json({ message: `Banner dengan id ${id} berhasil dihapus` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = Banner;
