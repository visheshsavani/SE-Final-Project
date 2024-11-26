import {foodModel} from "../models/foodModel.js";
import fs from 'fs';

// Function to update food details
const updateFood = async (req, res) => {
     try {
       const { id } = req.params;
       const { name, description, price, category } = req.body;
   
       // Check if a new image is uploaded
       let updatedFields = { name, description, price, category };
       if (req.file) {
         const food = await foodModel.findById(id);
         if (food.image) {
           fs.unlinkSync(`uploads/${food.image}`); // Delete old image
         }
         updatedFields.image = req.file.filename; // Update with new image
       }
   
       const updatedFood = await foodModel.findByIdAndUpdate(id, updatedFields, { new: true });
   
       if (!updatedFood) {
         return res.status(404).json({ success: false, message: 'Food not found' });
       }
   
       res.json({ success: true, message: 'Food updated successfully', food: updatedFood });
     } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, message: 'Error updating food' });
     }
   };

// add food item 

const addFood = async (req, res) =>{

     let image_filename = `${req.file.filename}`;

     const food = new foodModel({
          name: req.body.name,
          description : req.body.description,
          price: req.body.price,
          category: req.body.category,
          image: image_filename 
     })
     try{
          await food.save();
          res.json({success:true, message:"Food Added"});
     }catch (error){
          console.log(error)
          res.json({success:false, message:"Error"})
     }
}

// all food list
const listFood = async (req,res)=>{
     try {
          const foods = await foodModel.find({});
          res.json({success:true, data:foods});
     } catch (error) {
          console.log(error)
          res.json({success:false, message:"Error"})
     }
}

// remove food item

const removeFood = async(req,res)=>{
     try {
          const food = await foodModel.findById(req.body.id);
          fs.unlink(`uploads/${food.image}`, () => {})

          await foodModel.findByIdAndDelete(req.body.id);
          res.json({success:true, message:"Food Removed"})
     } catch (error) {
          console.log(error)
          res.json({success:false, message:"Error"})
     }
}

export {addFood, listFood, removeFood, updateFood}