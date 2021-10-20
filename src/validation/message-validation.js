const yup = require("yup");

const messageSchema = yup.object().shape({
  product: yup.string().required("The field product is required!"),
  quantity: yup.string().required("The field quantity is required!"),
});

function validateIncomingMessage(incomingMessage) {
  try {
    const validatedMessage = messageSchema.validateSync(incomingMessage);
    return validatedMessage;
  } catch (error) {
    throw { status: 400, message: error.message };
  }
}

module.exports = validateIncomingMessage;
