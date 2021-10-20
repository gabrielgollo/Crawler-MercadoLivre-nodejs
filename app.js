const express = require("express");
const bodyParse = require("body-parser");
const router = require("./router");
const app = express();
const port = 5000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
