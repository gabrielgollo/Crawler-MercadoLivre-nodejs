const RequestService = require("../services/request-service");
const validateMessage = require("../validation/message-validation");

class CrawlerController {
  static async onGet(req, res) {
    try {
      const incomingMessage = req.body;
      await validateMessage(incomingMessage);

      const data = await RequestService.start(req.body);

      console.log(`Produtos retornados: ${data.length}`);

      const responseData = {
        message: "Dados obtidos com sucesso!",
        status: 200,
        data,
      };

      res.send(responseData);
    } catch (error) {
      res.send({ status: error.status || 500, message: error.message });
    }
  }
}

module.exports = CrawlerController;
