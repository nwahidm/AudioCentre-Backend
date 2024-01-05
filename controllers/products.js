const { ObjectId } = require("mongodb");
const Products = require("../models/products");
const Brands = require("../models/brands");
const Categories = require("../models/categories");
const Subcategories = require("../models/subcategories");
const { isEmpty, assign, map } = require("lodash");
const fs = require("fs");
const url = "https://nwahidm.site";

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
    // const images = req.files.images; //images
    let variantImages1, variantImages2, variantImages3;
    let productImages0,
      productImages1,
      productImages2,
      productImages3,
      productImages4,
      productImages5,
      productImages6,
      productImages7,
      productImages8,
      productImages9,
      productImages10,
      productImages11,
      productImages12,
      productImages13,
      productImages14,
      productImages15,
      productImages16,
      productImages17,
      productImages18,
      productImages19;

    if (req.files.variantImages1) {
      variantImages1 = req.files.variantImages1;
    }

    if (req.files.variantImages2) {
      variantImages2 = req.files.variantImages2;
    }

    if (req.files.variantImages3) {
      variantImages3 = req.files.variantImages3;
    }

    if (req.files.productImages0) {
      productImages0 = req.files.productImages0;
    }

    if (req.files.productImages1) {
      productImages1 = req.files.productImages1;
    }

    if (req.files.productImages2) {
      productImages2 = req.files.productImages2;
    }

    if (req.files.productImages3) {
      productImages3 = req.files.productImages3;
    }

    if (req.files.productImages4) {
      productImages4 = req.files.productImages4;
    }

    if (req.files.productImages5) {
      productImages5 = req.files.productImages5;
    }

    if (req.files.productImages6) {
      productImages6 = req.files.productImages6;
    }

    if (req.files.productImages7) {
      productImages7 = req.files.productImages7;
    }

    if (req.files.productImages8) {
      productImages8 = req.files.productImages8;
    }

    if (req.files.productImages9) {
      productImages9 = req.files.productImages9;
    }

    if (req.files.productImages10) {
      productImages10 = req.files.productImages10;
    }

    if (req.files.productImages11) {
      productImages11 = req.files.productImages11;
    }

    if (req.files.productImages12) {
      productImages12 = req.files.productImages12;
    }

    if (req.files.productImages13) {
      productImages13 = req.files.productImages13;
    }

    if (req.files.productImages14) {
      productImages14 = req.files.productImages14;
    }

    if (req.files.productImages15) {
      productImages15 = req.files.productImages15;
    }

    if (req.files.productImages16) {
      productImages16 = req.files.productImages16;
    }

    if (req.files.productImages17) {
      productImages17 = req.files.productImages17;
    }

    if (req.files.productImages18) {
      productImages18 = req.files.productImages18;
    }

    if (req.files.productImages19) {
      productImages19 = req.files.productImages19;
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
      // images,
      weight,
      specification,
      status,
      isPromo,
      box
    );
    try {
      let imagePath = [];
      // for (let image of images) {
      //   imagePath.push(image.path);
      // }

      if (!isEmpty(productImages0)) {
        imagePath.push(productImages0[0].path);
      }

      if (!isEmpty(productImages1)) {
        imagePath.push(productImages1[0].path);
      }

      if (!isEmpty(productImages2)) {
        imagePath.push(productImages2[0].path);
      }

      if (!isEmpty(productImages3)) {
        imagePath.push(productImages3[0].path);
      }

      if (!isEmpty(productImages4)) {
        imagePath.push(productImages4[0].path);
      }

      if (!isEmpty(productImages5)) {
        imagePath.push(productImages5[0].path);
      }

      if (!isEmpty(productImages6)) {
        imagePath.push(productImages6[0].path);
      }

      if (!isEmpty(productImages7)) {
        imagePath.push(productImages7[0].path);
      }

      if (!isEmpty(productImages8)) {
        imagePath.push(productImages8[0].path);
      }

      if (!isEmpty(productImages9)) {
        imagePath.push(productImages9[0].path);
      }

      if (!isEmpty(productImages10)) {
        imagePath.push(productImages10[0].path);
      }

      if (!isEmpty(productImages11)) {
        imagePath.push(productImages11[0].path);
      }

      if (!isEmpty(productImages12)) {
        imagePath.push(productImages12[0].path);
      }

      if (!isEmpty(productImages13)) {
        imagePath.push(productImages13[0].path);
      }

      if (!isEmpty(productImages14)) {
        imagePath.push(productImages14[0].path);
      }

      if (!isEmpty(productImages15)) {
        imagePath.push(productImages15[0].path);
      }

      if (!isEmpty(productImages16)) {
        imagePath.push(productImages16[0].path);
      }

      if (!isEmpty(productImages17)) {
        imagePath.push(productImages17[0].path);
      }

      if (!isEmpty(productImages18)) {
        imagePath.push(productImages18[0].path);
      }

      if (!isEmpty(productImages19)) {
        imagePath.push(productImages19[0].path);
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
        if (product.discount < 100) {
          let discountValue = (product.price * product.discount) / 100;
          product.priceAfterDiscount = product.price - discountValue;
        } else {
          product.priceAfterDiscount = product.price - product.discount;
        }
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

      if (data.discount < 100) {
        let discountValue = (data.price * data.discount) / 100;
        data.priceAfterDiscount = data.price - discountValue;
      } else {
        data.priceAfterDiscount = data.price - data.discount;
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
        priceAfterDiscount: data.priceAfterDiscount,
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
      deletedImages,
      deletedImagesVariant1,
      deletedImagesVariant2,
      deletedImagesVariant3,
    } = req.body;

    if (!isEmpty(deletedImages)) {
      deletedImages = JSON.parse(deletedImages);
    }

    if (!isEmpty(deletedImagesVariant1)) {
      deletedImagesVariant1 = JSON.parse(deletedImagesVariant1);
    }

    if (!isEmpty(deletedImagesVariant2)) {
      deletedImagesVariant2 = JSON.parse(deletedImagesVariant2);
    }

    if (!isEmpty(deletedImagesVariant3)) {
      deletedImagesVariant3 = JSON.parse(deletedImagesVariant3);
    }

    if (!isEmpty(variant)) {
      variant = JSON.parse(variant);
    }

    let variantImages1, variantImages2, variantImages3;
    let productImages0,
      productImages1,
      productImages2,
      productImages3,
      productImages4,
      productImages5,
      productImages6,
      productImages7,
      productImages8,
      productImages9,
      productImages10,
      productImages11,
      productImages12,
      productImages13,
      productImages14,
      productImages15,
      productImages16,
      productImages17,
      productImages18,
      productImages19;

    if (req.files.variantImages1) {
      variantImages1 = req.files.variantImages1;
    }

    if (req.files.variantImages2) {
      variantImages2 = req.files.variantImages2;
    }

    if (req.files.variantImages3) {
      variantImages3 = req.files.variantImages3;
    }

    if (req.files.productImages0) {
      productImages0 = req.files.productImages0;
    }

    if (req.files.productImages1) {
      productImages1 = req.files.productImages1;
    }

    if (req.files.productImages2) {
      productImages2 = req.files.productImages2;
    }

    if (req.files.productImages3) {
      productImages3 = req.files.productImages3;
    }

    if (req.files.productImages4) {
      productImages4 = req.files.productImages4;
    }

    if (req.files.productImages5) {
      productImages5 = req.files.productImages5;
    }

    if (req.files.productImages6) {
      productImages6 = req.files.productImages6;
    }

    if (req.files.productImages7) {
      productImages7 = req.files.productImages7;
    }

    if (req.files.productImages8) {
      productImages8 = req.files.productImages8;
    }

    if (req.files.productImages9) {
      productImages9 = req.files.productImages9;
    }

    if (req.files.productImages10) {
      productImages10 = req.files.productImages10;
    }

    if (req.files.productImages11) {
      productImages11 = req.files.productImages11;
    }

    if (req.files.productImages12) {
      productImages12 = req.files.productImages12;
    }

    if (req.files.productImages13) {
      productImages13 = req.files.productImages13;
    }

    if (req.files.productImages14) {
      productImages14 = req.files.productImages14;
    }

    if (req.files.productImages15) {
      productImages15 = req.files.productImages15;
    }

    if (req.files.productImages16) {
      productImages16 = req.files.productImages16;
    }

    if (req.files.productImages17) {
      productImages17 = req.files.productImages17;
    }

    if (req.files.productImages18) {
      productImages18 = req.files.productImages18;
    }

    if (req.files.productImages19) {
      productImages19 = req.files.productImages19;
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
      status,
      deletedImages,
      deletedImagesVariant1,
      deletedImagesVariant2,
      deletedImagesVariant3
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
      if (!isEmpty(productImages0))
        assign(payload, { "images.0": productImages0[0].path });
      if (!isEmpty(productImages1))
        assign(payload, { "images.1": productImages1[0].path });
      if (!isEmpty(productImages2))
        assign(payload, { "images.2": productImages2[0].path });
      if (!isEmpty(productImages3))
        assign(payload, { "images.3": productImages3[0].path });
      if (!isEmpty(productImages4))
        assign(payload, { "images.4": productImages4[0].path });
      if (!isEmpty(productImages5))
        assign(payload, { "images.5": productImages5[0].path });
      if (!isEmpty(productImages6))
        assign(payload, { "images.6": productImages6[0].path });
      if (!isEmpty(productImages7))
        assign(payload, { "images.7": productImages7[0].path });
      if (!isEmpty(productImages8))
        assign(payload, { "images.8": productImages8[0].path });
      if (!isEmpty(productImages9))
        assign(payload, { "images.9": productImages9[0].path });
      if (!isEmpty(productImages10))
        assign(payload, { "images.10": productImages10[0].path });
      if (!isEmpty(productImages11))
        assign(payload, { "images.11": productImages11[0].path });
      if (!isEmpty(productImages12))
        assign(payload, { "images.12": productImages12[0].path });
      if (!isEmpty(productImages13))
        assign(payload, { "images.13": productImages13[0].path });
      if (!isEmpty(productImages14))
        assign(payload, { "images.14": productImages14[0].path });
      if (!isEmpty(productImages15))
        assign(payload, { "images.15": productImages15[0].path });
      if (!isEmpty(productImages16))
        assign(payload, { "images.16": productImages16[0].path });
      if (!isEmpty(productImages17))
        assign(payload, { "images.17": productImages17[0].path });
      if (!isEmpty(productImages18))
        assign(payload, { "images.18": productImages18[0].path });
      if (!isEmpty(productImages19))
        assign(payload, { "images.19": productImages19[0].path });

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

      let targetImages = [];
      if (!isEmpty(deletedImages)) {
        for (let e of deletedImages) {
          fs.unlinkSync(`./${targetProduct.images[e]}`);
          targetImages.push(targetProduct.images[e]);
        }
        await Products.remove(id, targetImages);
      }

      let targetImagesVariant1 = [];
      let targetImagesVariant2 = [];
      let targetImagesVariant3 = [];

      if (!isEmpty(deletedImagesVariant1)) {
        for (let e of deletedImagesVariant1) {
          fs.unlinkSync(`./${targetProduct.variant[0].images[e]}`);
          targetImagesVariant1.push(targetProduct.variant[0].images[e]);
        }
        await Products.removeVariant(id, 0, targetImagesVariant1);
      }

      if (!isEmpty(deletedImagesVariant2)) {
        for (let e of deletedImagesVariant2) {
          fs.unlinkSync(`./${targetProduct.variant[1].images[e]}`);
          targetImagesVariant2.push(targetProduct.variant[1].images[e]);
        }
        await Products.removeVariant(id, 1, targetImagesVariant2);
      }

      if (!isEmpty(deletedImagesVariant3)) {
        for (let e of deletedImagesVariant3) {
          fs.unlinkSync(`./${targetProduct.variant[2].images[e]}`);
          targetImagesVariant3.push(targetProduct.variant[2].images[e]);
        }
        await Products.removeVariant(id, 2, targetImagesVariant3);
      }

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

      for (let i in targetProduct.images) {
        fs.unlinkSync(`./${targetProduct.images[i]}`);
      }

      for (let o in targetProduct.variant) {
        for (let x in targetProduct.variant[o].images) {
          fs.unlinkSync(`./${targetProduct.variant[o].images[x]}`);
        }
      }

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
