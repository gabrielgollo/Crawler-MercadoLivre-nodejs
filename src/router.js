const express = require("express");
const router = express.Router();
const CrawlerController = require("./controller/crawler-controller");

router.get("/", (req, res) => {
  res.send("Tente usar a rota post!");
});

router.post("/", CrawlerController.onGet);

module.exports = router;
