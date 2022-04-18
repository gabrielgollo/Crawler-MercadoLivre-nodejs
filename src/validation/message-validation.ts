import * as yup from "yup";
import { RequestProduct } from "../@types/requestProduct";
import Exception from "../helpers/exception";

const messageSchema = yup.object().shape({
  product: yup.string().required("The field product is required!"),
  quantity: yup.string().required("The field quantity is required!"),
});

export function validateIncomingMessage(incomingMessage: RequestProduct) {
  try {
    return messageSchema.validateSync(incomingMessage);
  } catch (error) {
    throw new Exception(error as string, 400);
  }
}

