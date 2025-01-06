import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item

const addFood = async(req,res)=>{

    let image_filename = `${req.file.filename}`; // getting the image filename from req

    //creating new foodmodel

    const food = new foodModel({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        category : req.body.category,
        image : image_filename
    })
    try {
        await food.save(); // saving the food info in db
        res.json({success:true,message:"Food added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}

// allfood list

const listFood = async(req,res)=>{
    try {
        const foods=await foodModel.find({}); // this var will have all data of fooditems
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

//remove food item

const removeFood = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{}) // delete the image from uploads folder

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

export {addFood,listFood,removeFood}