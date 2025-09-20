import slugify from "slugify";
import { productModel } from "./../../../Database/models/product.model.js";
import { categoryModel } from "./../../../Database/models/category.model.js";
import { subCategoryModel } from "./../../../Database/models/subcategory.model.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const normalizeColorsValue = (val) => {
  if (val === undefined || val === null) return undefined;
  if (Array.isArray(val)) return val.map((c) => String(c));
  if (typeof val === "string") {
    const s = val.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed.map((c) => String(c));
      } catch (e) {
        // ignore
      }
    }
    if (s.includes(",")) {
      return s.split(",").map((c) => c.trim()).filter(Boolean);
    }
    return [s];
  }
  return [String(val)];
};

const addProduct = catchAsyncError(async (req, res, next) => {
  if (req.files) {
    if (req.files.imgCover && req.files.imgCover[0]) {
      req.body.imgCover = req.files.imgCover[0].filename;
    }
    if (req.files.images && req.files.images.length) {
      req.body.images = req.files.images.map((f) => f.filename);
    }
  }

  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true });
  }

  if (req.body.colors !== undefined) {
    req.body.colors = normalizeColorsValue(req.body.colors);
  }

  if (req.body.category) {
    const category = await categoryModel.findById(req.body.categoryId);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }
  }

  if (req.body.subcategory) {
    const subCategory = await subCategoryModel.findById(req.body.subCategoryId);
    if (!subCategory) {
      return next(new AppError("SubCategory not found", 404));
    }

    if (
      req.body.categoryId &&
      String(subCategory.category) !== String(req.body.categoryId)
    ) {
      return next(
        new AppError(
          "This subCategory does not belong to the given category",
          400
        )
      );
    }
  }

  const addProduct = new productModel(req.body);
  await addProduct.save();

  res.status(201).json({ message: "success", addProduct });
});

const getAllProducts = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search(["title", "descripton", "colors"]) // Include colors in search
    .sort();

  await apiFeature.countDocuments();

  const getAllProducts = await apiFeature.mongooseQuery;

  if (getAllProducts.length === 0) {
    return next(new AppError("No products found", 404));
  }

  const pagination = apiFeature.getPaginationMetadata();

  res.status(200).json({
    message: "success",
    page: pagination.page,
    limit: pagination.limit,
    totalPages: pagination.totalPages,
    totalDocuments: pagination.totalDocuments,
    getAllProducts,
  });
});

const getProductById = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({ message: "success", product });
});

const getProductBySlug = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findOne({ slug: req.params.slug });
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({ message: "success", product });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  if (req.files) {
    if (req.files.imgCover && req.files.imgCover[0]) {
      req.body.imgCover = req.files.imgCover[0].filename;
    }
    if (req.files.images && req.files.images.length) {
      req.body.images = req.files.images.map((f) => f.filename);
    }
  }

  if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true });

  if (req.body.colors !== undefined) {
    req.body.colors = normalizeColorsValue(req.body.colors);
  }

  const updateProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updateProduct) return next(new AppError("Product not found", 404));

  res.status(201).json({ message: "success", updateProduct });
});

const deleteProduct = deleteOne(productModel, "product");

const getProductsByCategory = catchAsyncError(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await categoryModel.findById(categoryId);
  if (!category) return next(new AppError("Category not found", 404));

  const products = await productModel.find({ category: categoryId });

  res.status(200).json({ message: "success", results: products.length, products });
});

const getProductsBySubCategory = catchAsyncError(async (req, res, next) => {
  const { subCategoryId } = req.params;

  const subCategory = await subCategoryModel.findById(subCategoryId);
  if (!subCategory) return next(new AppError("SubCategory not found", 404));

  const products = await productModel.find({ subcategory: subCategoryId });

  res.status(200).json({ message: "success", results: products.length, products });
});

export {
  addProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubCategory
};