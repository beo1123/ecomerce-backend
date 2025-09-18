import slugify from "slugify";
import { categoryModel } from "./../../../Database/models/category.model.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addCategory = catchAsyncError(async (req, res, next) => {
  console.log(req.file);
  req.body.Image = req.file.filename;
  req.body.slug = slugify(req.body.name, { lower: true });
  const addcategory = new categoryModel(req.body);
  await addcategory.save();

  res.status(201).json({ message: "success", addcategory });
});

const getAllCategories = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(categoryModel.find(), req.query)
    .pagination()
    .fields()
    .filteration()
    .search()
    .sort();
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;
  let getAllCategories = await apiFeature.mongooseQuery;
  // getAllCategories = getAllCategories.map((element)=>{
  //   element.Image = `http://localhost:3000/category/${element.Image}`
  //   return element
  // })

  res
    .status(201)
    .json({ page: PAGE_NUMBER, message: "success", getAllCategories });
});

const updateCategory = catchAsyncError(async (req, res, next) => {
  if (req.file) req.body.Image = req.file.filename;
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });

  const updateCategory = await categoryModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updateCategory) return next(new AppError("Category not found", 404));

  res.status(201).json({ message: "success", updateCategory });
});


const getCategoryBySlug = catchAsyncError(async (req, res, next) => {
  const categoryData = await categoryModel.findOne({ slug: req.params.slug });
  if (!categoryData) return next(new AppError("Category not found", 404));

  res.status(200).json({ message: "success", category: categoryData });
});



const deleteCategory = deleteOne(categoryModel, "category");
export { addCategory, getAllCategories, updateCategory, deleteCategory, getCategoryBySlug };
