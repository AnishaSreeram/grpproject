const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error:"PRODUCT NOT FOUND"
            });
        }
        req.product = product;
        next();
    });

};

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "PROBLEM WITH IMAGE"
            });
        }
        //destructure the fields
        const {name, description, price, category, stock} = fields;
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error: "PLEASE INCLUDE ALL FIELDS"
            });
        }

        let product = new Product(fields);

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "FILE SIZE TOO BIG"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to the db
        product.save((err,product) => {
            if(err){
                res.status(400).json({
                    error: "SAVING DRESS IN DB FAILED"
                });
            }
            res.json(product);
        });
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

//delete controllers
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "FAILED TO DELETE THE PRODUCT"
            });
        }
        res.json({
            message: "DELETION WAS A SUCCESS",
            deletedProduct
        });
    });
};

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "PROBLEM WITH IMAGE"
            });
        }

        //updation code
        let product = req.product;
        product = _.extend(product, fields);

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "FILE SIZE TOO BIG"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error:"UPDATION OF PRODUCT FAILED"
                });
            }
            res.json(product);
        });

    });
};

//product listing

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error: "NO PRODUCT FOUND"
            });
        }
        res.json(products)
    });
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err,category) => {
        if(err){
            return res.status(400).json({
                error: "NO CATEGORY FOUND"
            });
        }
        res.json(category);
    });
};


exports.updateStock = (req, res, next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        };
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error: "BULK OPERATION FAILED"
            });
        }

        next();
    });
};

