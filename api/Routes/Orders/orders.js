const express = require('express');
const orders = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/orderSchema');
const Product = require('../../models/productSchema');
//get All Products
orders.get('/', (req, res, next) => {
    Order.find()
        .populate('Product')
        .exec()
        .then(rep => {
            console.log(rep);
            res.status(200).json({
                message: "get All orders",
                orders: rep
            })
        })
        .catch(err => {
            console.log(err);
        })
});
//get Single order
orders.get('/:ordersId', (req, res, next) => {
    const id = req.params.ordersId;
    Order.find({ _id: id })
        .exec()
        .then(data => {
            console.log('data inserted');
            res.status(200).json({
                message: "get Single order",
                id: id,
                singleDa: data
            })
        }).catch(err => {
            console.log(err);
        })

});

//Post Product
orders.post('/', (req, res, next) => {
    const id = req.params.ordersId;
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity
    });
    //  console.log(order);
    order.save()
        .then(data => {
            console.log(data);
            res.status(201).json({
                message: "Insert Single Product",
                id: id,
                order: data
            })
        })
        .catch(err => {
            console.log(err);
        })

});

//Patch orders
orders.patch('/:ordersId', (req, res, next) => {
    const id = req.params.ordersId;
    Order.updateOne({ _id: id }, { $set: { product: req.body.product, quantity: req.body.quantity } })
        .exec()
        .then(data => {
            console.log('updated Order');
            res.status(200).json({
                message: "Update Single order",
                id: id,
                dat: {
                    productId: data.product,
                    q: data.quantity,
                    req: {
                        type: "GET",
                        url: "http:localhost:3000/orders/" + data._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
        })
});
//delete Product
orders.delete('/:ordersId', (req, res, next) => {
    const id = req.params.ordersId;
    Order.deleteOne({ _id: id })
        .exec()
        .then(da => {
            console.log("deleted");
            res.status(200).json({
                message: "Delete Single order",
                id: id
            })
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = orders;