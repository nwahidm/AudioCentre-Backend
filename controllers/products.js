const { ObjectId } = require("mongodb");
const Products = require("../models/products");
const Brands = require("../models/brands");
const Categories = require("../models/categories");
const Subcategories = require("../models/subcategories");
const { isEmpty, assign, map } = require("lodash");

class Product {
  static async create(req, res) {
    const {
      name,
      description,
      brandId,
      categoryId,
      subcategoryId,
      price,
      discount,
      variant,
      weight,
      specification,
      status,
    } = req.body;
    const images = req.files.images;
    console.log(
      "[Create Product]",
      name,
      description,
      brandId,
      categoryId,
      subcategoryId,
      price,
      discount,
      variant,
      images,
      weight,
      specification,
      status
    );
    try {
      let imagePath = [];
      for (let image of images) {
        imagePath.push(image.path);
      }

      await Products.create({
        name,
        description,
        brandId,
        categoryId,
        subcategoryId,
        price,
        discount,
        variant,
        imagePath,
        weight,
        specification,
        status,
      });

      res
        .status(201)
        .json({
          status: true,
          message: `Produk berhasil ditambahkan`,
          result: "",
        });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Internal Server Error", result: "" });
    }
  }

  static async fetchProducts(req, res) {
    const {
      name,
      brandId,
      categoryId,
      subcategoryId,
      minimumPrice,
      maximumPrice,
      order,
      limit,
      offset,
    } = req.body;
    console.log(
      "[Fetch All Products]",
      name,
      brandId,
      categoryId,
      subcategoryId,
      minimumPrice,
      maximumPrice,
      order,
      limit,
      offset
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(name)) assign(payload, { name });
      if (!isEmpty(brandId)) assign(payload, { brandId });
      if (!isEmpty(categoryId)) assign(payload, { categoryId });
      if (!isEmpty(subcategoryId)) assign(payload, { subcategoryId });
      if (!isEmpty(minimumPrice)) assign(payload, { minimumPrice });
      if (!isEmpty(maximumPrice)) assign(payload, { maximumPrice });
      if (!isEmpty(limit)) assign(payload, { limit });
      if (!isEmpty(offset)) assign(payload, { offset });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        if (order[0].column == 1) searchOrder = { nama: order[0].dir };
        else if (order[0].column == 2) searchOrder = { price: order[0].dir };
      }

      const products = await Products.findAll(payload, searchOrder);

      if (isEmpty(products))
        throw {
          status: false,
          error: "Bad Request",
          message: "Produk tidak tersedia",
          result: "",
        };

      for (let i = 0; i < products.length; i++) {
        const product = products[i];

        product.brand = await Brands.findByPk(product.brandId);
        product.category = await Categories.findByPk(product.categoryId);
        product.subcategory = await Subcategories.findByPk(
          product.subcategoryId
        );
        product.priceAfterDiscount = product.price - product.discount;
      }

      res
        .status(200)
        .json({ status: true, message: "success", result: products });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
      }
    }
  }

  static async findProduct(req, res) {
    const { id } = req.params;
    try {
      const data = await Products.findByPk(id);

      if (isEmpty(data))
        throw {
          status: false,
          error: "Bad Request",
          message: "Produk tidak ditemukan",
          result: "",
        };

      const brand = await Brands.findByPk(data.brandId);
      const category = await Categories.findByPk(data.categoryId);
      const subcategory = await Subcategories.findByPk(data.subcategoryId);

      const Product = {
        _id: data._id,
        name: data.name,
        description: data.description,
        brand,
        category,
        subcategory,
        price: data.price,
        discount: data.discount,
        priceAfterDiscount: data.price - data.discount,
        variant: data.variant,
        images: data.images,
        weight: data.weight,
        specification: data.specification,
        status: data.status,
      };

      res
        .status(200)
        .json({ status: true, message: "success", result: Product });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
      }
    }
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const {
      name,
      description,
      brandId,
      categoryId,
      subcategoryId,
      price,
      discount,
      variant,
      weight,
      specification,
      status,
    } = req.body;
    console.log(
      "[Update Product]",
      id,
      name,
      description,
      brandId,
      categoryId,
      subcategoryId,
      price,
      discount,
      variant,
      weight,
      specification,
      status
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(name)) assign(payload, { name });
      if (!isEmpty(description)) assign(payload, { description });
      if (!isEmpty(brandId))
        assign(payload, { brandId: new ObjectId(brandId) });
      if (!isEmpty(categoryId))
        assign(payload, { categoryId: new ObjectId(categoryId) });
      if (!isEmpty(subcategoryId))
        assign(payload, { subcategoryId: new ObjectId(subcategoryId) });
      if (!isEmpty(price)) assign(payload, { price: +price });
      if (!isEmpty(discount)) assign(payload, { discount: +discount });
      if (!isEmpty(variant)) assign(payload, { variant: JSON.parse(variant) });
      if (!isEmpty(weight)) assign(payload, { weight });
      if (!isEmpty(specification))
        assign(payload, { specification: JSON.parse(specification) });
      if (!isEmpty(status)) assign(payload, { status: +status });

      //check if the product exist or not
      const targetProduct = await Products.findByPk(id);

      if (isEmpty(targetProduct))
        throw {
          status: false,
          error: "Bad Request",
          message: "Produk tidak ditemukan",
          result: "",
        };

      await Products.update(id, payload);

      res
        .status(201)
        .json({
          status: true,
          message: `Produk berhasil diupdate`,
          result: "",
        });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
      }
    }
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const targetProduct = await Products.findByPk(id);

      if (isEmpty(targetProduct))
        throw {
          status: false,
          error: "Bad Request",
          message: "Produk tidak ditemukan",
          result: "",
        };

      await Products.destroy(id);

      res.status(200).json({
        status: true,
        message: `Product dengan id ${id} berhasil dihapus`,
        result: "",
      });
    } catch (error) {
      if (error.status == false) {
        res.status(404).json(error);
      } else {
        res
          .status(500)
          .json({
            status: false,
            message: "Internal Server Error",
            result: "",
          });
      }
    }
  }
}

module.exports = Product;
