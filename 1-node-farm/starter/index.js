const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
//
// const textOut = `this is what we know about the avocado: ${textIn}. \n Created on ${Date.now()}`;
//
// fs.writeFileSync('./txt/input.txt', textOut);
//

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8',
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8',
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8',
);

let dataObject = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
dataObject = JSON.parse(dataObject);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
console.log(slugify('fresh avocados', { lower: true }));

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHTML = dataObject
            .map((el) => replaceTemplate(tempCard, el))
            .join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

        console.log(output);
        res.end(output);
        // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

        // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        console.log(dataObject);

        res.end(dataObject);

        // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
