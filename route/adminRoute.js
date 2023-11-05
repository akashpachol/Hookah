const express = require("express");
const adminRoute = express();
const multer=require('../middleware/multer')
const adminController = require("../controller/admin/adminController");
const categoryController=require("../controller/admin/categoryController");

const adminAuth = require("../middleware/adminAuth");
// LOGIN
adminRoute.get("/", adminAuth.isLogout, adminController.loadAdminLogin);
adminRoute.post("/", adminController.verifyLogin);

// HOME
adminRoute.get("/home", adminAuth.isLogin, adminController.loadHome);

// Add Category
adminRoute.get("/category", adminAuth.isLogin, categoryController.loadCategory);
adminRoute.post("/category",multer.uploadCategory.single('category_image'), categoryController.addCategory);
adminRoute.get("/deleteCategory/:id", categoryController.deleteCategory);

// Add Products
adminRoute.get("/products", adminAuth.isLogin, adminController.loadProducts);



module.exports = adminRoute;
