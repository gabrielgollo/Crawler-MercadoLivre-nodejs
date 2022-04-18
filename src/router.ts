import { Router, Request, Response } from "express";
import AppControler from "./controller/appController";

const router = Router();

router.post("/", AppControler.onGet);

router.all("/", (_req: Request, res: Response): void => {
  res.send("Tente usar a rota post!");
});


export {router};
