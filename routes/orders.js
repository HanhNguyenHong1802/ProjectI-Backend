var express = require("express");
const bodyParser = require("body-parser");
var Orders = require("../models/order");
var cors = require("./cors");
var router = express.Router();
var authenticate = require("./authenticate");

router.use(bodyParser.json());
router.options("*", cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});
router
  .route("/")
  .get(cors.cors, async (req, res, next) => {
    try {
      orders = await Orders.find(req.query).populate("author");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(orders);
    } catch (err) {
      next(err);
    }
  })
  .post(
    cors.corsWithOptions,
    authenticate.checkUser,
    async (req, res, next) => {
      if (req.body != null) {
        try {
          req.body.author = req.user._id;
          order = await Orders.create(req.body);
          order = await Orders.findById(order._id).populate("author");
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(order);
          console.log("Successfully created the new order: " + order);
        } catch (err) {
          next(err);
        }
      } else {
        err = new Error("The request body is empty.");
        err.status = 404;
        next(err);
      }
    }
  );

router.route("/:author").get(cors.cors, async (req, res, next) => {
  const author = req.params.author;
  try {
    orders = await Orders.find({ author: author }).populate("author");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(orders);
  } catch (err) {
    next(err);
  }
});
router
  .route("/:orderId")
  .put(
    cors.corsWithOptions,
    authenticate.checkUser,
    authenticate.checkAdmin,
    async (req, res, next) => {
      if (req.body != null) {
        try {
          order = Orders.findById(req.params.orderId);
          if (order != null) {
            if (!order.author.equals(req.user._id) && !order.author.isAdmin) {
              err = new Error("You can not modify others' orders.");
              err.status = 403;
              next(err);
            }
            req.body.author = req.user._id;
            order = await Orders.findByIdAndUpdate(
              req.params.orderId,
              {
                $set: req.body,
              },
              { new: true }
            ).exec();
            order = await Orders.findById(order._id).populate("author");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(order);
            console.log("Successfully updated the order: " + order);
          } else {
            err = new Error("Order " + req.params.orderId + " does not exist.");
            err.status = 404;
            next(err);
          }
        } catch (error) {
          next(err);
        }
      } else {
        err = new Error("The request body is empty.");
        err.status = 404;
        next(err);
      }
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.checkUser,
    authenticate.checkAdmin,
    async (req, res, next) => {
      try {
        order = await Orders.findByIdAndRemove(req.params.orderId);
        if (order) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(order);
          console.log("The order: " + order + " has been deleted");
        }
      } catch (err) {
        next(err);
      }
    }
  );
module.exports = router;
