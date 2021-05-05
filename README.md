## Challenge Proposal

The challenge to develop a api to perform a search on the www.mercadolivre.com.br website, returning a list of products.

### Post Request

### URL

```
{
    "search": String,
    "limit": Int,
}
```

#### Example

```
{
    "search": "Cadeado",
    "limit": 15,
}
```

### Response

```
{
"name": String,
"link": String
"price": Number,
"store": String,
"state": String,
}
```