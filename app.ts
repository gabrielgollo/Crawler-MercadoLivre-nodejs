import express from "express";
import {router} from './src/router'

const app = express();
const port = 5000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
