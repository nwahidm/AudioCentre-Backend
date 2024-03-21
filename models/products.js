const { isEmpty, assign } = require("lodash");
const { getDB } = require("../config");
const { ObjectId } = require("mongodb");

class Products {
  static productModel() {
    return getDB().collection("products");
  }

  static async create({
    name,
    title,
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
  }) {
    const slug = name.replace(/[^\w]/gi, "");
    const newProduct = await this.productModel().insertOne({
      slug,
      name,
      title,
      description,
      brandId: new ObjectId(brandId),
      categoryId: new ObjectId(categoryId),
      subcategoryId: new ObjectId(subcategoryId),
      price: +price,
      discount: +discount,
      variant,
      images: imagePath,
      weight,
      specification: JSON.parse(specification),
      box: JSON.parse(box),
      status: +status,
      isPromo: +isPromo,
    });
    return newProduct;
  }

  static async findAll(payload, searchOrder) {
    let {
      slug,
      name,
      title,
      brandId,
      categoryId,
      subcategoryId,
      minimumPrice,
      maximumPrice,
      isPromo,
      limit,
      offset,
    } = payload;
    console.log(
      "[ Payload ]",
      slug,
      name,
      title,
      brandId,
      categoryId,
      subcategoryId,
      minimumPrice,
      maximumPrice,
      isPromo,
      limit,
      offset
    );
    console.log("[ Order ]", searchOrder);

    const where = {};
    if (!isEmpty(slug) && !isEmpty(name))
      assign(where, {
        $or: [
          { slug: { $regex: slug, $options: "i" } },
          { name: { $regex: name, $options: "i" } },
        ],
      });
    if (!isEmpty(slug) && isEmpty(name))
      assign(where, { slug: { $regex: slug, $options: "i" } });
    if (!isEmpty(name) && isEmpty(slug))
      assign(where, { name: { $regex: name, $options: "i" } });
    if (!isEmpty(title))
      assign(where, { title: { $regex: title, $options: "i" } });
    if (!isEmpty(brandId)) assign(where, { brandId: new ObjectId(brandId) });
    if (!isEmpty(categoryId))
      assign(where, { categoryId: new ObjectId(categoryId) });
    if (!isEmpty(subcategoryId))
      assign(where, { subcategoryId: new ObjectId(subcategoryId) });
    if (!isEmpty(isPromo)) assign(where, { isPromo: +isPromo });
    if (!isEmpty(minimumPrice) && isEmpty(maximumPrice)) {
      assign(where, {
        price: { $gt: Number(minimumPrice) },
      });
    }
    if (isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        price: { $lte: Number(maximumPrice) },
      });
    }
    if (!isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        price: { $gte: Number(minimumPrice), $lte: Number(maximumPrice) },
      });
    }
    if (isEmpty(limit)) limit = 10000;
    if (isEmpty(offset)) offset = 0;
    if (!isEmpty(searchOrder)) {
      let newOrder = { status: -1, ...searchOrder };

      return await this.productModel()
        .aggregate([
          {
            $match: where,
          },
          { $project: { comments: 0 } },
          {
            $lookup: {
              from: "brands",
              localField: "brandId",
              foreignField: "_id",
              as: "brand",
            },
          },
          {
            $unwind: "$brand",
          },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $lookup: {
              from: "subcategories",
              localField: "subcategoryId",
              foreignField: "_id",
              as: "subcategory",
            },
          },
          {
            $unwind: "$subcategory",
          },
        ])
        .sort(newOrder)
        .skip(+offset)
        .limit(+limit)
        .toArray();
    }

    return await this.productModel()
      .aggregate([
        {
          $match: where,
        },
        { $project: { comments: 0 } },
        {
          $lookup: {
            from: "brands",
            localField: "brandId",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $unwind: "$brand",
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategory",
          },
        },
        {
          $unwind: "$subcategory",
        },
      ])
      .skip(+offset)
      .limit(+limit)
      .toArray();
  }

  static async distinct(payload) {
    const {
      slug,
      name,
      title,
      categoryId,
      subcategoryId,
      brandId,
      minimumPrice,
      maximumPrice,
      isPromo,
      limit,
      offset,
    } = payload;
    console.log(
      "[ Payload Distinct ]",
      slug,
      name,
      title,
      categoryId,
      subcategoryId,
      brandId,
      minimumPrice,
      maximumPrice,
      isPromo,
      limit,
      offset
    );

    const where = {};
    if (!isEmpty(slug) && !isEmpty(name))
    assign(where, {
      $or: [
        { slug: { $regex: slug, $options: "i" } },
        { name: { $regex: name, $options: "i" } },
      ],
    });
  if (!isEmpty(slug) && isEmpty(name))
    assign(where, { slug: { $regex: slug, $options: "i" } });
  if (!isEmpty(name) && isEmpty(slug))
    assign(where, { name: { $regex: name, $options: "i" } });
    if (!isEmpty(title))
      assign(where, { title: { $regex: title, $options: "i" } });
    if (!isEmpty(categoryId))
      assign(where, { categoryId: new ObjectId(categoryId) });
    if (!isEmpty(subcategoryId))
      assign(where, { subcategoryId: new ObjectId(subcategoryId) });
    if (!isEmpty(isPromo)) assign(where, { isPromo: +isPromo });
    if (!isEmpty(minimumPrice) && isEmpty(maximumPrice)) {
      assign(where, {
        price: { $gte: Number(minimumPrice) },
      });
    }
    if (isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        price: { $lte: Number(maximumPrice) },
      });
    }
    if (!isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        price: { $gte: Number(minimumPrice), $lte: Number(maximumPrice) },
      });
    }

    return await this.productModel().distinct("brandId", where);
  }

  static async count(payload) {
    const {
      slug,
      name,
      title,
      brandId,
      categoryId,
      subcategoryId,
      minimumPrice,
      maximumPrice,
      isPromo,
      limit,
      offset,
    } = payload;
    console.log(
      "[ Payload Count ]",
      slug,
      name,
      title,
      brandId,
      categoryId,
      subcategoryId,
      minimumPrice,
      maximumPrice,
      isPromo,
      limit,
      offset
    );

    const where = {};
    if (!isEmpty(slug) && !isEmpty(name))
    assign(where, {
      $or: [
        { slug: { $regex: slug, $options: "i" } },
        { name: { $regex: name, $options: "i" } },
      ],
    });
  if (!isEmpty(slug) && isEmpty(name))
    assign(where, { slug: { $regex: slug, $options: "i" } });
  if (!isEmpty(name) && isEmpty(slug))
    assign(where, { name: { $regex: name, $options: "i" } });
    if (!isEmpty(title))
      assign(where, { title: { $regex: title, $options: "i" } });
    if (!isEmpty(brandId)) assign(where, { brandId: new ObjectId(brandId) });
    if (!isEmpty(categoryId))
      assign(where, { categoryId: new ObjectId(categoryId) });
    if (!isEmpty(subcategoryId))
      assign(where, { subcategoryId: new ObjectId(subcategoryId) });
    if (!isEmpty(isPromo)) assign(where, { isPromo: +isPromo });
    if (!isEmpty(minimumPrice) && isEmpty(maximumPrice)) {
      assign(where, {
        price: { $gt: Number(minimumPrice) },
      });
    }
    if (isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        price: { $lte: Number(maximumPrice) },
      });
    }
    if (!isEmpty(minimumPrice) && !isEmpty(maximumPrice)) {
      assign(where, {
        price: { $gte: Number(minimumPrice), $lte: Number(maximumPrice) },
      });
    }

    return await this.productModel().countDocuments(where);
  }

  static async findOne({ payload }) {
    return await this.productModel().findOne({ payload });
  }

  static async findByPk(id) {
    return await this.productModel().findOne({
      _id: new ObjectId(`${id}`),
    });
  }

  static async update(id, payload) {
    return await this.productModel().updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
  }

  static async destroy(id) {
    return await this.productModel().deleteOne({ _id: new ObjectId(id) });
  }

  static async remove(id, payload) {
    return await this.productModel().updateOne(
      { _id: new ObjectId(id) },
      {
        $pullAll: {
          images: payload,
        },
      }
    );
  }

  static async setCover(id, payload) {
    return await this.productModel().updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          images: {
            $each: [`${payload}`],
            $position: 0
          },
        },
      }
    );
  }

  static async removeVariant(id, index, payload) {
    return await this.productModel().updateOne(
      { _id: new ObjectId(id) },
      {
        $pullAll: { [`variant.${index}.images`]: payload },
      }
    );
  }
}

module.exports = Products;
