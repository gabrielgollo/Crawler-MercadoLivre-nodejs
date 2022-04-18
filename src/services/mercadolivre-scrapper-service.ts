import cheerio from "cheerio";
import axios from "axios";
import { productInfo } from "../@types/productInfo";
import Exception from '../helpers/exception'

export class MercadolivreScrapperService{
    //Do a request to MercadoLivre and the page HTML using cheerio
  static async startScrapper(promisesRequests: any, limit: number): Promise<productInfo[]> {
    try {
      const promisesResponse = await axios.all(promisesRequests) as any;

      const $: cheerio.Root[] = [];
      for (let i in promisesResponse) {
        const data: string = promisesResponse[i]?.data;
        $.push(cheerio.load(data));
      }

      let list = await this.getProductsFromHtml($, limit);
      return await Promise.all(list);
    } catch (err) {
      console.log(err);
      throw new Exception("Failed to request data!", 500)
    }
  }

  // Get and return a list from html of a total limit of products
  private static async getProductsFromHtml(bodyHtml: cheerio.Root[], limit = 0): Promise<productInfo[]> {
    const productList: productInfo[] = [];
    var total = 0;
    for (let $ of bodyHtml) {
      let count = 0;

      $(".ui-search-layout--stack .ui-search-result").each(
        function (_i, e) {
          if (count == limit) {
            return true;
          }
          const priceSelector = "div.ui-search-item__group.ui-search-item__group--price > div > div > div > span.price-tag.ui-search-price__part > span.price-tag-amount"
          const elementPrice = $(e).find(priceSelector);
          const elementPriceText = elementPrice.text().replace("R$", "").replace(",", ".");
          
          const price = parseFloat(elementPriceText);

          if (productList.length == limit) {
            return productList;
          }

          // Adiciona os Elementos na Lista de produtos
          productList.push({
            name: $(e).find(".ui-search-item__title").text().trim(),
            link: $(e)
              .find(".ui-search-item__group__element.ui-search-link")
              .attr("href") as string,
            price: price,
            store: $(e)
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