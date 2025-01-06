import userModel from "../models/userModel.js"


// add items to user cart

const addToCart = async(req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);// using the userid from the middleware
        let cartData = await userData.cartData; // getting cart data from user data
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId]=1; // adding new item to the cart
        }
        else{
            cartData[req.body.itemId] += 1; // increasing the count if item already present
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Added to Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove items from user cart

const removeFromCart = async(req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){ // if the food is present in the cart 
            cartData[req.body.itemId] -= 1; // we are decrementing the count
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed from Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// fetch user cart data

const getCart = async(req,res)=>{
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {addToCart,removeFromCart,getCart}