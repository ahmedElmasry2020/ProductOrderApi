const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/userSchema');
const bcrypt = require('bcrypt');
var jwt = require('json-web-token');
const jwt2 = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(check => {
            console.log(check);
            if (check.length < 1) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message: "Failed"
                        })
                    }
                    else {
                        console.log(hash);
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                            .save()
                            .then(data => {
                                console.log(data);
                                res.status(201).json({
                                    message: "Saved",
                                    data: data
                                })
                            })
                    }
                })
            }
            else{
                res.status(409).json({
                    message:'already exists'
                })
            }
        })
        .catch(err => {
            console.log(err);
        })

});

router.post('/signin', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(data => {
            console.log(data);
            if (data.length < 1) {
               res.status(500).json({
                   messge:"Not Authenticte"
               }) 
            }
            else{
                var payload=[];
                const hashedPss= User.find({email:req.body.email})
                .exec()
                .then(pass=>{
                    console.log("pass");
                    console.log(pass);
                    payload.push({id:pass[0]._id,email:pass[0].email});
                    console.log(payload);
                    bcrypt.compare(req.body.pssword,pass.password,checkPss=>{
                        if(checkPss){
                            //console.log(pass.password);
                            console.log(payload[0].email);
                            // jwt.encode("secret", payload, function (err, token) {
                            //     if (err) {
                            //       console.error(err.name, err.message);
                            //     } else {
                            //         console.log("token");
                            //       console.log(token);
                            //     User.updateOne({email:payload[0].email},{$set:{token:token}})
                            //     .exec()
                            //     .then(()=>{
                            //         console.log('updated success');
                            //     })
                            //     .catch(err=>{
                            //         console.log(err);
                            //     })
                            //       // decode
                            //     //   jwt.decode(secret, token, function (err_, decodedPayload, decodedHeader) {
                            //     //     if (err) {
                            //     //       console.error(err.name, err.message);
                            //     //     } else {
                            //     //       console.log(decodedPayload, decodedHeader);
                            //     //     }
                            //     //   });
                            //     }
                            //   });
                            const token=jwt2.sign(payload[0],'secret',{
                                expiresIn:'1h'
                            })
                            res.status(200).json({
                                messge:"welcome"+req.body.email,
                                pss:pass,
                                token1:token
                            })
                        }
                        else{
                            res.status(500).json({
                                messge:"Not Auth"+req.body.email
                            })
                        }
                    })
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        message:'error'
                    })
                })
               
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                messge:"err",
                err:err
            })
        })

});

module.exports = router;