const express = require('express');
const mongoose = require("mongoose");
const products = express.Router();
const Product = require('../../models/productSchema');
const multer = require('multer');
const auth = require('../../middleware/check-auth');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
var perPage = 7
    //, page = Math.max(0, req.param('page'))
    , page = 0

//get All Products
products.get('/', (req, res, next) => {
    
    Product.find()
        .select('Name Price _id')
        .limit(perPage)
        .skip(perPage * page)
        .sort({
            Name: 'asc'
        })
        .exec()
        .then(data => {
            console.log(data);
            const resp = {
                count: data.length,
                products:
                    data.map(res => {
                        return {
                            type: "GET",
                            // count :productLength,
                            name: res.Name,
                            price: res.Price,
                            url: "http://localhost:3000/products/" + res._id
                        }
                    })

            }
            res.status(200).json({
                resp,
                message: "get All Products",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "error"
            })
        })
});

//get Single Product
products.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // const id= req.body._id;
    // console.log(Product.find(id));
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            const resp = {
                name: doc.Name,
                price: doc.price,
                type: "GET",
                url: "http://localhost:3000/products" + doc._id

            }
            res.status(200).json({
                message: "find Successfuly",
                data: resp
            })
        })
        .catch(
            err => {
                console.log(err);
                message: "fialed to retreive"
            })

});


//Post Product
products.post('/', auth, upload.single('productImage'), (req, res, next) => {
    //  const id =req.params.productId;
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        Name: req.body.name,
        Price: req.body.price,
        poductImage: req.file.path
    });

    product.save()
        .then(result => {
            console.log(product)
            console.log(result)
            res.status(201).json({
                message: "Insert Single Product",
                //   id:id,
                product: {
                    name: req.body.name,
                    price: req.body.price,
                    createdDate: new Date(),
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result._id,
                        imageUrl: "http://localhost:3000/products/" + result.poductImage
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
        })

});

//Patch Product
products.patch('/:productId', auth, (req, res, next) => {
    const id = req.params.productId;
    Product.update({ _id: id }, { $set: { Name: req.body.newName, Price: req.body.newPrice } })
        .then(() => {
            console.log("updated");
            res.status(200).json({
                message: "Update Single Product",
                id: id
            })
        })
        .catch(err => {
            console.log(err);
        })


});

//delete Product
products.delete('/:productId', auth, (req, res, next) => {
    const id = req.params.productId;
    Product
        .deleteOne({ _id: id })
        .then(res => {
            console.log('deleted');
            // res.status(200).json({
            //     message: "Delete Single Product",
            //     id: id
            // })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "not deleted"
            })
        })

});

module.exports = products;