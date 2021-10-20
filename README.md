## Um API Crawler do Mercado Livre para extrair o preço, o link, o nome e a loja do anúncio de um produto.


>## Challenge Proposal
>
>The challenge to develop a api to perform a search on the www.mercadolivre.com.br website, returning a list of products.
>
>### Post Request
>
>### URL
>
>```
>{
>    "product": String,
>    "quantity": Int,
>}
>```
>
>#### Example
>
>```
>{
>    "product": "Cadeado",
>    "quantity": 15,
>}
>```
>
>### Response
>
>```
>{
>"name": String,
>"link": String
>"price": Number,
>"store": String,
>}
>```
>