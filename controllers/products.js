const { ObjectId } = require("mongodb");
const Products = require("../models/products");
const Brands = require("../models/brands");
const Categories = require("../models/categories");
const Subcategories = require("../models/subcategories");
const { isEmpty, assign, map } = require("lodash");
const url = "https://audio-centre.nwahidm.site";

class Product {
  static async create(req, res) {
    let {
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
      isPromo,
      box,
    } = req.body;

    variant = JSON.parse(variant);
    const images = req.files.images;
    let variantImages1, variantImages2, variantImages3;

    if (req.files.variantImages1) {
      variantImages1 = req.files.variantImages1;
    }

    if (req.files.variantImages2) {
      variantImages2 = req.files.variantImages2;
    }

    if (req.files.variantImages3) {
      variantImages3 = req.files.variantImages3;
    }

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
      status,
      isPromo,
      box
    );
    try {
      let imagePath = [];
      for (let image of images) {
        imagePath.push(image.path);
      }

      let variantImagesPath1 = [];
      let variantImagesPath2 = [];
      let variantImagesPath3 = [];

      if (!isEmpty(variantImages1)) {
        for (let i of variantImages1) {
          variantImagesPath1.push(i.path);
        }
        assign(variant[0], { images: variantImagesPath1 });
      }

      if (!isEmpty(variantImages2)) {
        for (let i of variantImages2) {
          variantImagesPath2.push(i.path);
        }
        assign(variant[1], { images: variantImagesPath2 });
      }

      if (!isEmpty(variantImages3)) {
        for (let i of variantImages3) {
          variantImagesPath3.push(i.path);
        }
        assign(variant[2], { images: variantImagesPath3 });
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
        box,
        status,
        isPromo,
      });

      res.status(201).json({
        status: true,
        message: `Produk berhasil ditambahkan`,
        result: "",
      });
    } catch (error) {
      console.log(error);
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
      isPromo,
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
      if (!isEmpty(isPromo)) assign(payload, { isPromo });
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
        for (let j = 0; j < product.images.length; j++) {
          product.images[j] = `${url}/${product.images[j]}`;
        }

        for (let x in product.variant) {
          for (let y in product.variant[x].images) {
            product.variant[x].images[
              y
            ] = `${url}/${product.variant[x].images[y]}`;
          }
        }
      }

      res
        .status(200)
        .json({ status: true, message: "success", result: products });
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
      for (let i = 0; i < data.images.length; i++) {
        data.images[i] = `${url}/${data.images[i]}`;
      }
      for (let o in data.variant) {
        for (let x in data.variant[o].images) {
          data.variant[o].images[x] = `${url}/${data.variant[o].images[x]}`;
        }
      }

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
        box: data.box,
        status: data.status,
        isPromo: data.isPromo,
      };

      res
        .status(200)
        .json({ status: true, message: "success", result: Product });
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

  static async updateProduct(req, res) {
    const { id } = req.params;
    let {
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
      box,
      isPromo,
      status,
    } = req.body;

    variant = JSON.parse(variant);
    let variantImages1, variantImages2, variantImages3;

    if (req.files.variantImages1) {
      variantImages1 = req.files.variantImages1;
    }

    if (req.files.variantImages2) {
      variantImages2 = req.files.variantImages2;
    }

    if (req.files.variantImages3) {
      variantImages3 = req.files.variantImages3;
    }
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
      box,
      isPromo,
      status
    );
    try {
      let variantImagesPath1 = [];
      let variantImagesPath2 = [];
      let variantImagesPath3 = [];

      if (!isEmpty(variantImages1)) {
        for (let i of variantImages1) {
          variantImagesPath1.push(i.path);
        }
        assign(variant[0], { images: variantImagesPath1 });
      }

      if (!isEmpty(variantImages2)) {
        for (let i of variantImages2) {
          variantImagesPath2.push(i.path);
        }
        assign(variant[1], { images: variantImagesPath2 });
      }
      if (!isEmpty(variantImages3)) {
        for (let i of variantImages3) {
          variantImagesPath3.push(i.path);
        }
        assign(variant[2], { images: variantImagesPath3 });
      }

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
      if (!isEmpty(variant)) assign(payload, { variant });
      if (!isEmpty(weight)) assign(payload, { weight });
      if (!isEmpty(specification))
        assign(payload, { specification: JSON.parse(specification) });
      if (!isEmpty(box)) assign(payload, { box: JSON.parse(box) });
      if (!isEmpty(isPromo)) assign(payload, { isPromo: +isPromo });
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

      res.status(201).json({
        status: true,
        message: `Produk berhasil diupdate`,
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
        res.status(500).json({
          status: false,
          message: "Internal Server Error",
          result: "",
        });
      }
    }
  }
}

module.exports = Product;
