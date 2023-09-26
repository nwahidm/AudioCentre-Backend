const Products = require("../models/products");
const { isEmpty, assign } = require("lodash");

class Product {
  static async create(req, res) {
    const {
      brand,
      name,
      description,
      price,
      color,
      category,
      weight,
      specification,
    } = req.body;
    const images = req.files.images;
    console.log(
      brand,
      name,
      description,
      price,
      color,
      category,
      images,
      weight,
      specification
    );
    try {
      if (!isEmpty(images)) {
        let imagePath = [];
        for (let image of images) {
          imagePath.push(image.path);
        }
      }

      await Products.create({
        brand,
        name,
        description,
        price,
        color,
        category,
        imagePath,
        weight,
        specification,
      });

      res.status(201).json({ message: `Produk berhasil ditambahkan` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async fetchProducts(req, res) {
    const { name, brand, category, minimumPrice, maximumPrice, order } =
      req.body;
    console.log(
      "[Fetch All Products]",
      name,
      brand,
      category,
      minimumPrice,
      maximumPrice
    );
    try {
      //search query
      const payload = {};
      if (!isEmpty(name)) assign(payload, { name });
      if (!isEmpty(brand)) assign(payload, { brand });
      if (!isEmpty(category)) assign(payload, { category });
      if (!isEmpty(minimumPrice)) assign(payload, { minimumPrice });
      if (!isEmpty(maximumPrice)) assign(payload, { maximumPrice });

      //order list
      let searchOrder = {};
      if (!isEmpty(order)) {
        if (order[0].column == 1) searchOrder = { nama: order[0].dir };
        else if (order[0].column == 2) searchOrder = { brand: order[0].dir };
        else if (order[0].column == 3) searchOrder = { category: order[0].dir };
        else if (order[0].column == 4) searchOrder = { price: order[0].dir };
      }

      const products = await Products.findAll(payload, searchOrder);

      if (isEmpty(products))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Produk tidak tersedia",
        };

      res.status(200).json(products);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async findProduct(req, res) {
    const { id } = req.params;
    try {
      const data = await Products.findByPk(id);

      if (isEmpty(data))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Produk tidak ditemukan",
        };

      const Product = {
        _id: data._id,
        brand: data.brand,
        name: data.name,
        description: data.description,
        price: data.price,
        color: data.color,
        category: data.category,
        images: data.images,
        weight: data.weight,
        specification: data.specification
      };

      res.status(200).json(Product);
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const {
      brand,
      name,
      description,
      price,
      color,
      category,
      weight,
      specification,
    } = req.body;
    console.log(
      "[Update Product]",
      id,
      brand,
      name,
      description,
      price,
      color,
      category,
      weight,
      specification
    );
    try {
      //update data
      const payload = {};
      if (!isEmpty(brand)) assign(payload, { brand });
      if (!isEmpty(name)) assign(payload, { name });
      if (!isEmpty(description)) assign(payload, { description });
      if (!isEmpty(price)) assign(payload, { price: +price });
      if (!isEmpty(color)) assign(payload, { color });
      if (!isEmpty(category)) assign(payload, { category });
      if (!isEmpty(weight)) assign(payload, { weight });
      if (!isEmpty(specification)) assign(payload, { specification });

      //check if the product exist or not
      const targetProduct = await Products.findByPk(id);

      if (isEmpty(targetProduct))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Produk tidak ditemukan",
        };

      await Products.update(id, payload);

      res.status(201).json({ message: `Produk berhasil diupdate` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const targetProduct = await Products.findByPk(id);

      if (isEmpty(targetProduct))
        throw {
          status: 404,
          error: "Bad Request",
          message: "Produk tidak ditemukan",
        };

      await Products.destroy(id);

      res.status(200).json({ message: `Product with id ${id} deleted` });
    } catch (error) {
      if (error.status == 404) {
        res.status(404).json(error);
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = Product;
