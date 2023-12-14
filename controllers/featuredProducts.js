const { ObjectId } = require("mongodb");
const Products = require("../models/products");
const FeaturedProducts = require("../models/featuredProducts");
const { isEmpty, assign, map } = require("lodash");
const fs = require("fs");
const url = "https://nwahidm.site";

class FeaturedProduct {
  static async create(req, res) {
    const {
      productId,
      featuredProductName,
      featuredProductUrl,
      featuredProductStatus,
    } = req.body;
    const featuredProductBanner = req.files.images;
    console.log(
      "[Create Featured Product]",
      productId,
      featuredProductName,
      featuredProductUrl,
      featuredProductBanner,
      featuredProductStatus
    );
    try {
      const id = productId;
      const targetProduct = await Products.findByPk(id);

      if (isEmpty(targetProduct))
        throw {
          status: false,
          error: "Bad Request",
          message: "Product tidak tersedia",
          result: "",
        };

      await FeaturedProducts.create({
        productId,
        featuredProductName,
        featuredProductUrl,
        featuredProductBanner: featuredProductBanner[0].path,
        featuredProductStatus,
      });

      res.status(201).json({
        status: true,
        message: `Featured Product berhasil ditambahkan`,
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

  static async fetchFeaturedProducts(req, res) {
    const { productId, featuredProductStatus, order } = req.body;
    console.log(
      "[Fetch All Featured Products]",
      productId,
      featuredProductStatus,
      order
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(featuredProductStatus))
        assign(payload, { featuredProductStatus });
      if (!isEmpty(productId)) assign(payload, { productId });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        searchOrder = { featuredProductStatus: order[0].dir };
      }

      const featuredProducts = await FeaturedProducts.findAll(
        payload,
        searchOrder
      );

      if (isEmpty(featuredProducts))
        throw {
          status: false,
          error: "Bad Request",
          message: "Featured Product tidak tersedia",
          result: "",
        };

      map(featuredProducts, (o) => {
        o.featuredProductBanner = `${url}/${o.featuredProductBanner}`;
      });

      res
        .status(200)
        .json({ status: true, message: "success", result: featuredProducts });
    } catch (error) {
      console.log(error);
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

  static async findFeaturedProduct(req, res) {
    const { id } = req.params;
    try {
      const data = await FeaturedProducts.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Feature Product tidak ditemukan",
          result: "",
        };

      data.featuredProductBanner = `${url}/${data.featuredProductBanner}`;

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

  static async updateFeaturedProduct(req, res) {
    const { id } = req.params;
    const { featuredProductName, featuredProductUrl, featuredProductStatus } =
      req.body;
    let featuredProductBanner;
    if (req.files) {
      featuredProductBanner = req.files.images;
    }
    console.log(
      "[Update Featured Product]",
      id,
      featuredProductName,
      featuredProductUrl,
      featuredProductStatus,
      featuredProductBanner
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(featuredProductName))
        assign(payload, { featuredProductName });
      if (!isEmpty(featuredProductUrl)) assign(payload, { featuredProductUrl });
      if (!isEmpty(featuredProductStatus))
        assign(payload, { featuredProductStatus: +featuredProductStatus });
      if (!isEmpty(featuredProductBanner))
        assign(payload, {
          featuredProductBanner: featuredProductBanner[0].path,
        });

      //check if the featured product exist or not
      const targetFeaturedProduct = await FeaturedProducts.findByPk(id);

      if (isEmpty(targetFeaturedProduct))
        throw {
          status: false,
          error: "Bad Request",
          message: "Featured Product tidak ditemukan",
          result: "",
        };

      await FeaturedProducts.update(id, payload);

      res.status(201).json({
        status: true,
        message: `Featured Product berhasil diupdate`,
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

  static async deleteFeaturedProduct(req, res) {
    const { id } = req.params;
    try {
      const targetFeaturedProduct = await FeaturedProducts.findByPk(id);

      if (isEmpty(targetFeaturedProduct))
        throw {
          status: false,
          error: "Bad Request",
          message: "Featured Product tidak ditemukan",
          result: "",
        };

      fs.unlinkSync(`./${targetFeaturedProduct.featuredProductBanner}`);

      await FeaturedProducts.destroy(id);

      res.status(200).json({
        status: true,
        message: `Featured Product dengan id ${id} berhasil dihapus`,
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

module.exports = FeaturedProduct;
