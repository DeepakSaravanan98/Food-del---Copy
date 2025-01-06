import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// placing user order from frontend

const placeOrder = async(req,res)=>{

    const frontend_url = "http://localhost:5174"

    try {
        const newOrder = new orderModel({
            userId : req.body.userId, // from the middleware
            items : req.body.items,
            amount : req.body.amount,
            address : req.body.address
        })

        await newOrder.save()

        // after saving neworder we are cleaning the user cartdata
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

        // creating stripe payment link

        const line_items = req.body.items.map((item)=>({
            price_data : {
                currency : 'inr',
                product_data : {
                    name:item.name
                },
                unit_amount : item.price*100*1  //converting from $ to inr
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data : {
                currency : 'inr',
                product_data : {
                    name:"Delivery Charges"
                },
                unit_amount : 2*100*20  //converting from $ to inr
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// verifying the order

const verifyOrder = async(req,res)=>{
    const {orderId,success} = req.body;
    try {
        /* if the payment is success it will be true in the url so by that we are updating
           the payment property in the orderModel of that order to true */
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message:"Paid"})
        }
        /* else if the payment is failure we are deleting the order from the db*/
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Not paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})    
    }
}

//users order for frontend

const userOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({userId:req.body.userId}); //finding all orders of the user  
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//Listing orders for admin panel

const listOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//api for updating order status

const updateStatus = async(req,res)=>{
    try {
        //finding the orderId from body and updating status
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status}); 
        res.json({success:true,message:"Status updated"})
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}