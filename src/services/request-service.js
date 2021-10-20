const axios = require("axios");
const cheerio = require("cheerio");

class RequestService {
  static async start({ product, quantity }) {
    const urlArray = [
      axios.get(`https://lista.mercadolivre.com.br/${product}_DisplayType_LF`),
    ];

    for (let i = 50; i < quantity; i += 50) {
      urlArray.push(
        axios.get(
          `https://lista.mercadolivre.com.br/${product}_Desde_${
            i + 1
          }_DisplayType_LF`
        )
      );
    }

    const response = await this.requestMercadolivre(urlArray, quantity);

    return response;
  }

  //Do a request to MercadoLivre and the page HTML using cheerio
  static async requestMercadolivre(url, limit) {
    try {
      let body = await axios.all(url);

      const $ = [];
      for (let i in body) {
        $[i] = cheerio.load(body[i].data);
      }

      let list = await this.getProductsFromHtml($, limit);
      return await Promise.all(list);
    } catch (err) {
      console.log(err);
      return { status: 500, message: "Failed to request data!" };
    }
  }

  // Get and return a list from html of a total limit of products
  static async getProductsFromHtml(bodyHtml, limit = 0) {
    const productList = [];
    var total = 0;
    for (let $ of bodyHtml) {
      let count = 0;

      let scrappingName = $(".ui-search-layout--stack .ui-search-result").each(
        function (i, e) {
          if (count == limit) {
            return true;
          }

          let price = $(this).find(".ui-search-price__second-line");
          price = $(price[0].children[0].children[1]).text();
          price = price.replace(".", "").replace(",", ".");
          price = parseFloat(price.slice(price.indexOf("R") + 2));

          if (productList.length == limit) {
            return productList;
          }

          // Adiciona os Elementos na Lista de produtos
          productList.push({
            name: $(this).find(".ui-search-item__title").text().trim(),
            link: $(this)
              .find(".ui-search-item__group__element.ui-search-link")
              .attr("href"),
            price: price,
            store: $(this)
              .find(".ui-search-official-store-item__link")
              .text()
              .slice(12),
          });
          count++;
        }
      );
      total += count;
    }
    return productList;
  }
}
module.exports = RequestService;
