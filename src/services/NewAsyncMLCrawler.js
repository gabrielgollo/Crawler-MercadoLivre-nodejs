const axios = require("axios");
const cheerio = require("cheerio");

async function start(jsonData) {
  let search = jsonData.search;
  let limit = jsonData.limit;
  let getlistData = [];
  let url = [
    axios.get(`https://lista.mercadolivre.com.br/${search}_DisplayType_LF`),
  ];

  for (let i = 50; i < limit; i += 50) {
    url.push(
      axios.get(
        `https://lista.mercadolivre.com.br/${search}_Desde_${
          i + 1
        }_DisplayType_LF`
      )
    );
  }

  //console.log(url)

  let anotherlist = await requestMercadolivre(url, limit);

  return anotherlist;
}

//Do a request to MercadoLivre and the page HTML using cheerio
async function requestMercadolivre(url, limit) {
  let reallimit = limit;
  try {
    //console.log("HEErrrrrrrrrrrrEEEEEEEEEE")
    let body = await axios.all(url);
    //console.log(body)
    const $ = [];
    for (let i in body) {
      $[i] = cheerio.load(body[i].data);
    }

    let list = await getlist($, limit);
    //console.log(list)
    return await Promise.all(list);
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

// Get and return a list from html of a total limit of products
async function getlist(bodyHtml, limit = 0) {
  var listaProdutos = [];
  var total = 0;
  for (let $ of bodyHtml) {
    //console.log($)
    let count = 0;
    //console.log($('.ui-search-layout--stack .ui-search-result').length)

    let scrappingName = $(".ui-search-layout--stack .ui-search-result").each(
      function (i, e) {
        if (count == limit) {
          return true;
        }

        let price = $(this).find(".ui-search-price__second-line");
        price = $(price[0].children[0].children[1]).text();
        price = price.replace(".", "").replace(",", ".");
        price = parseFloat(price.slice(price.indexOf("R") + 2));

        if (listaProdutos.length == limit) {
          return listaProdutos;
        }

        // Adiciona os Elementos na Lista de produtos
        listaProdutos.push({
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
  return listaProdutos;
}

module.exports = start;
