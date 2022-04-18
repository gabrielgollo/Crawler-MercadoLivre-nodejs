import { Request, Response } from "express";
import { productInfo } from "../@types/productInfo";
import { RequestProduct } from "../@types/requestProduct";
import { MercadolivreScrapperService } from "../services/mercadolivre-scrapper-service";

import { RequestService } from "../services/request-service";
import {validateIncomingMessage} from "../validation/message-validation";

export class AppController {
  static async onGet(req: Request, res: Response) {
    try {
      await validateIncomingMessage(req.body);
      const incomingMessage = {
        product: req?.body?.product,
        quantity: req?.body?.quantity,
      };

      const { product, quantity }:RequestProduct = incomingMessage;

      const requestPromises = RequestService.mountRequests({ product, quantity: Number(quantity) });
      const scrapperResponse: productInfo[] = await MercadolivreScrapperService.startScrapper(requestPromises, Number(quantity))

      console.log(`Produtos retornados: ${scrapperResponse.length}`);

      const responseData = {
        message: "Dados obtidos com sucesso!",
        status: 200,
        data: scrapperResponse,
      };

      res.send(responseData);
    } catch (error: any) {
      res.send({ status: error.status || 500, message: error.message });
    }
  }
}
 export default AppController;