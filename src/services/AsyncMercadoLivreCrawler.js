const axios = require('axios')
const cheerio = require('cheerio')

//Do a request to MercadoLivre and the page HTML using cheerio
async function requestMercadolivre(search, url, limit){
    let reallimit = limit
    try{
        //console.log("HEErrrrrrrrrrrrEEEEEEEEEE")
        let body = await axios.all(url)
        //console.log(body)
        const $ = []
        for(let i in body){
            $[i] = cheerio.load(body[i].data)
        }
        let list = []
        for(let bodyHtml of $){
            if(limit-50 >= 0){
                list.push( getlist(bodyHtml, 50, reallimit))
                limit= limit - 50
            }
            else{
                list.push( getlist(bodyHtml, limit, reallimit))
            } 
        }

        return await Promise.all(list)

    } catch(err){
        console.log(err)
        return undefined
    }

}

// Get and return a list from html of a total limit of products
async function getlist(bodyHtml, limit=0, reallimit){
    let listaProdutos = []
    let $ = bodyHtml
    //console.log($)
    let count = 0
    //console.log($('.ui-search-layout--stack .ui-search-result').length)

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
            pricevar = parseFloat(pricevar.slice(2, pricevar.indexOf('R', 3)))*1000
        }

        if(listaProdutos.length==reallimit){
            return listaProdutos
        }
        // Adiciona os Elementos na Lista de produtos
        listaProdutos.push({
            "name": $(this).find('.ui-search-item__title').text().trim(),
            "link": $(this).find('.ui-search-item__group__element.ui-search-link').attr('href'),
            "price": pricevar,
            "store": $(this).find('.ui-search-official-store-item__link').text().slice(12, )
        })
        count++

    });

    return listaProdutos
}

async function start(jsonData){
    let search = jsonData.search
    let limit = jsonData.limit
    let getlistData = []
    let url = [axios.get(`https://lista.mercadolivre.com.br/${search}_DisplayType_LF`)]
    
    for(let i=50; i<limit; i+=50){
        url.push(axios.get(`https://lista.mercadolivre.com.br/${search}_Desde_${i+1}_DisplayType_LF`))
    }  
    
    console.log(url)

    let anotherlist = await requestMercadolivre(search, url, limit)
    
    for(let i of anotherlist){
        for(let j of i){
            getlistData.push( j )
        }
    }
    //console.log(getlistData)
    //console.log(search, limit)

    return getlistData
}



module.exports = start