import { userModel } from "../../../Database/models/user.model.js";
import { deleteOne } from "../../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { AppError } from "../../utils/AppError.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";

const addUser = catchAsyncError(async (req, res, next) => {
  const addUser = new userModel(req.body);
  await addUser.save();

  res.status(201).json({ message: "success", addUser });
});

const getUserByToken = catchAsyncError(async (req, res, next) => {
  // User is already attached by protectedRoutes middleware
  const user = await userModel.findById(req.user._id).select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({ message: "success", user });
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  let apiFeature = new ApiFeatures(userModel.find().select('-password'), req.query)
    .filteration()
    .search(["name", "email"]) // Chỉ định các trường tìm kiếm cho User
    .sort()
    .fields()
    .pagination(10);

  const users = await apiFeature.mongooseQuery;
  const PAGE_NUMBER = apiFeature.queryString.page * 1 || 1;

  if (users.length === 0) {
    return next(new AppError("No users found", 404));
  }

  res.status(201).json({ page: PAGE_NUMBER, message: "success", users });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updateUser = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  updateUser && res.status(201).json({ message: "success", updateUser });

  !updateUser && next(new AppError("User was not found", 404));
});

const changeUserPassword = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  req.body.passwordChangedAt = Date.now();
  console.log(req.body.passwordChangedAt);
  const changeUserPassword = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  changeUserPassword &&
    res.status(201).json({ message: "success", changeUserPassword });

  !changeUserPassword && next(new AppError("User was not found", 404));
});

const deleteUser = deleteOne(userModel, "user");

export { addUser, changeUserPassword, deleteUser, getAllUsers, getUserByToken, updateUser };

