# PrestaShop API Client

This is a server-side library that exposes the PrestaShop web service
as resource and model abstractions. It allows web service consumers to be
unaware of the web service's HTTP interface, or how to deal with XML payloads.

### Basic usage

Create a client instance

```javascript
import { rest } from 'prestashop-api-client';

const client = new rest.Client({
  language: 'en',
  languages: {
    'en': 1,
    'es': 2,
  },
  webservice: {
    key: 'YOUR_PRESTASHOP_API_KEY',
    scheme: 'https',
    host: 'your-prestashop-domain',
    root: '/api',
  },
});
```

Access a resource
```javascript
const resource = client.resource('products');
```

Retrieve all models exposed by a resource
```
resource.list().then((models) => {
  // models is an Array containing Model instances
});
```

Retrieve a single model from a resource by its ID
```
resource.get(id).then((model) => {
  // model is a Model instance
});
```


### Resources

- products
- images
- manufacturers
- combinations
- stock_availables
- product_option_values

### Models

- Product
- Image
- Manufacturer
- Combination
- StockAvailable
- ProductOptionValue


### Model relations

Some concrete Models implement methods that return a Resource. When a Model
returns a Resource this way, that resource is configured to act on objects
that are *related to that model*. 

`Product`

```javascript
// get an Images resource that exposes Image models related to the Product
product.images()

// get Image models related to the Product
product.images().list()

// get a Manufacturers resource
product.manufacturer()

// get the related Manufacturer model
product.manufacturer().first()

// get a Combinations resource
product.combinations()

// get Combination models related to the Product
product.combinations().list()
```

### Client options

`languages`

    A dictionary that maps ISO-639-1 language codes to PrestaShop language ids.

`language`

    The language to select when parsing translatable attributes.

`webservice`

    HTTP request parameters

    key       HTTP Basic Auth username
    scheme    defaults to "https"
    host      your PrestaShop host
    root      the api root path; defaults to "/api"

`cache`

    An [LRU cache instance](https://www.npmjs.com/package/lru-cache), or an
    object that duck-types an LRU cache.

`logger`

    A logger instance. Defaults to dummy logger that doesn't log anything.


### Contributing

1. Fork `develop` branch
2. Push changes to your fork.
3. Submit a pull request.


### License

MIT
