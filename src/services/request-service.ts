const axios = require("axios");
export class RequestService {
  static mountRequests({product, quantity}: { product: string; quantity: number }) {
    const urlArray = [
      axios.get(`https://lista.mercadolivre.com.br/${product}_DisplayType_LF`),
    ];

    for (let i = 50; i < quantity; i += 50) {
      urlArray.push(
        axios.get(
          `https://lista.mercadolivre.com.br/${product}_Desde_${i + 1
          }_DisplayType_LF`
        )
      );
    }

    return urlArray;
  }
}

