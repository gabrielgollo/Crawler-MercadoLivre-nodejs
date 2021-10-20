const express = require("express");
const router = express.Router();
//const crawler = require('./src/services/NewAsyncMLCrawler')
const crawler = require("./src/services/NewAsyncMLCrawler");

router.get("/", (req, res) => {
  res.send("Tente usar a rota post!");
});

router.post("/", async (req, res) => {
  let crawlerData = await crawler(req.body);

  console.log("quantidade de dados retornados=" + crawlerData.length);
  res.send(crawlerData);
});

module.exports = router;
