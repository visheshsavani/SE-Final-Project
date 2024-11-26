import {orderModel} from "../models/orderModel.js";
import {userModel} from "../models/userModel.js"
import Stripe from "stripe"
// const Stripe = require('stripe');

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const Stripe = require('stripe');
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // placing user order without Stripe integration
// const placeOrder = async (req, res) => {
//      const frontend_url = process.env.FRONTEND_URL;

//      try {
//           // Create and save the new order
//           const newOrder = new orderModel({
//                userId: req.body.userId,
//                items: req.body.items,
//                amount: req.body.amount,
//                address: req.body.address,
//                payment: false, // Initially, payment is false
//                status: "Pending" // Add an initial status if needed
//           })
//           await newOrder.save(); 

//           // Optionally clear the cart data for the user
//           await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//           // Respond to the frontend with success
//           res.json({
//                success: true,
//                message: "Order placed successfully",
//                orderId: newOrder._id
//           });
//      } catch (error) {
//           console.log(error);
//           res.json({ success: false, message: "Error placing order" });
//      }
// }

// placing user order for frontend with Stripe . also change frontend file src/pages/placeOrder
const placeOrder = async (req, res) => {

     const frontend_url = process.env.FRONTEND_URL;

     try {
          const newOrder = new orderModel({
               userId:req.body.userId,
               items:req.body.items,
               amount:req.body.amount,
               address:req.body.address
          })
          await newOrder.save();
          await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});

          const line_items = req.body.items.map((item )=>({
               price_data :{
                    currency: 'inr',
                    product_data:{
                         name:item.name,
                    },
                    // unit_amount:item.price*100*80
                    unit_amount:item.price*100
               },
               quantity:item.quantity
          }))

          line_items.push({
               price_data :{
                    currency: 'inr',
                    product_data:{
                         name:"Delivery Charges",
                    },
                    // unit_amount:2*100*80
                    unit_amount:2*100
               },
               quantity:1
          })

          const session = await stripe.checkout.sessions.create({
               line_items:line_items,
               mode: 'payment',
               success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
               cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
          });

          res.json({success:true, session_url:session.url})
     } catch (error) {
          console.log(error);
          res.json({success:false, message:"Error"})
     }
}

const verifyOrder = async (req, res) => {
     const {orderId, success} = req.body;
     try {
          if(success == "true"){
               await orderModel.findByIdAndUpdate(orderId, {payment:true});
               res.json({success:true, message:"Paid"})
          }else{
               await orderModel.findByIdAndDelete(orderId);
               res.json({success:false, message:"Unpaid"})
          }
     } catch (error) {
          console.log(error);
          res.json({success:false, message:"Error"});
     }
}

//user orders for frontend
const userOrders = async (req, res) => {
     try {
          const orders = await orderModel.find({userId:req.body.userId})
          res.json({success:true, data:orders})
     } catch (error) {
          console.log(error);
          res.json({success:false, message:"Error"})
     }
}

// listing orders for admin panel
const listOrders = async (req, res)=>{
     try {
          const orders = await orderModel.find({});
          res.json({success:true, data:orders})
     } catch (error) {
          console.log(error);
          res.json({success:false, message:"Error"})
     }
}

//api for updating order status 
const updateStatus = async (req, res) => {
     try {
          await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status})
          res.json({success:true, message:"Status updated"})
     } catch (error) {
          console.log(error);
          res.json({success:false, message:"Error"})
     }
}

export {placeOrder, verifyOrder, userOrders, listOrders,updateStatus}