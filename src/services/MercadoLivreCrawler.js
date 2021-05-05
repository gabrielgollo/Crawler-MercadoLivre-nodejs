const axios = require('axios')
const cheerio = require('cheerio')

//Do a request to MercadoLivre and the page HTML using cheerio
async function requestMercadolivre(search, url=`https://lista.mercadolivre.com.br/${search}_DisplayType_LF`){
    let BASE_URL = url

    try{
        let body = await axios.get(BASE_URL)
        console.log(BASE_URL)
        const $ = cheerio.load(body.data)
        return $
    } catch(err){
        console.log(err)
        return undefined
    }

}

// Get and return a list from html of a total limit of products
async function getlist(bodyHtml, limit=0){
    let $ = bodyHtml
    let backup = $
    let listaProdutos = []
    let count = 0;

    do{
        let backup = $
        let scrappingName = $('.ui-search-layout--stack .ui-search-result').each( function (i, e) {
            if(count == limit){
                return true;
            }

            let pricevar = String($(this).find('.price-tag.ui-search-price__part').text()).replace(',', '.')
            //let originalprice = pricevar
            let numberOfR = 0
            let lastindexOfR = 0
            // Conta a quantidade de R dos R$
            for(let char in pricevar){
                if(pricevar[char] == "R"){
                    numberOfR++
                    lastindexOfR = char
                }
            }

            // Se a quantidade de R for maior que 2, ele lê a string do Segundo R até o último(Terceiro)
            if(numberOfR > 2){
                pricevar = parseFloat(pricevar.slice(pricevar.indexOf('R', 3)+2, lastindexOfR))
            }else{
                pricevar = parseFloat(pricevar.slice(2, pricevar.indexOf('R', 3)))
            }

            // Adiciona os Elementos na Lista de produtos
            listaProdutos.push({
                "name": $(this).find('.ui-search-item__title').text().trim(),
                "link": $(this).find('.ui-search-item__group__element.ui-search-link').attr('href'),
                "price": pricevar,
                //"original": originalprice,
                "store": $(this).find('.ui-search-official-store-item__link').text().slice(12, )
            })
            count++
        });
        
        if(count<limit){
            let nextPageurl = backup('.andes-pagination__button.andes-pagination__button--next a').attr('href')
            if(nextPageurl.length < 3){
                break
            }
            $ = await requestMercadolivre('teste', nextPageurl)
        }

    }while(count < limit);
    return listaProdutos
}

async function start(jsonData){
    let search = jsonData.search
    let limit = jsonData.limit

    let bodyHtml = await requestMercadolivre(search)

    let getlistData = await getlist(bodyHtml, limit)

    console.log(getlistData)
    console.log(search, limit)

    return getlistData
}



module.exports = start