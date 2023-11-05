const { log } = require("console");
const Category = require("../../model/categoryModel");
const fs=require('fs')

const loadCategory = async (req, res) => {
    try {
      const categorydata = await Category.find();
      res.render("admin/category", { categorydata, message: "" });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const addCategory = async (req, res) => {
    try {
      console.log(req.file.filename,"lllll");
      console.log("12",req.file);
      const { addcategory, Availability } = req.body;
      const {filename}=req.file
      const findCaterory = await Category.findOne({ category: addcategory });
  
      const categorydata = await Category.find();
  
      if (findCaterory) {
        console.log("start");
        res.render("admin/category", {
          messsage: "category already add",
          categorydata,
        });
      } else {
        const newCategory = new Category({
          category: addcategory,
          Availability,
          image:filename,
        });
  
        const data = await newCategory.save();
        console.log(data, "kkkkkkkkkk");
        res.redirect("/admin/category");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //delete category
  const deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      console.log(categoryId);
      
      const result = await Category.findByIdAndDelete(categoryId);
  
      if (result && result.image !== '') {
        try {
          fs.unlinkSync("public/assets/images/category/" + result.image);
        } catch (err) {
          console.log(err);
        }
      }
  
      res.redirect('/admin/category');
    } catch (error) {
      console.log(error.message);
    }
  };
  

  module.exports = {

    loadCategory,
    deleteCategory,
    addCategory,
  };
  