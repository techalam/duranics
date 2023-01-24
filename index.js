var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
const multer = require("multer");
// const port = process.env.PORT || 3000;
var SESSION_SECRET_KEY = "asdfgthftdgcvfgrtdgshycgsfdrefdh";
// import {createPool} from 'mysql2/promise';

const fs = require('fs');
const path = require('path');
const uploadsFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}


const PORT = process.env.PORT || 3000

const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || 'usersdb'
const DB_PORT = process.env.DB_PORT || 3306

const con = mysql.createConnection({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME
})



// mysql.createConnection({

//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "node_project"

// })

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('uploads'));

// var con = mysql.createConnection({

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
    
//     })


// const MYSQL_URL = `mysql://${{ MYSQLUSER }}:${{ MYSQLPASSWORD }}@${{ MYSQLHOST }}:${{ MYSQLPORT }}/${{ MYSQLDATABASE }}`;

con.connect();

// const sqll = "ALTER TABLE enquiry ADD PRIMARY KEY (id)";

// con.query(sqll, function (err, result) {
//   if (err) throw err;
//   console.log("Primary key added to the table");
// });


app.get('/enquiry', (req, res) => {
  res.render('pages/enquiry');
});
app.get('/admin',(req,res) =>{
res.render('pages/admin');
});

app.post('/submit', (req, res) => {
  const sql = "INSERT INTO enquiry values ('" + req.body.name + "','" + req.body.email + "','" + req.body.message + "')";
  con.query(sql, (err) => {
    if (err) throw err;
    console.log("Data inserted into the database.");
    res.render('pages/enquiry');
  })
});

// app.post('/upload', upload.single('file'),(req,res) =>{

//   file = req.file
//   // const name = req.body.name

//   id = req.body.id
//   price = req.body.price
//   description = req.body.description
//   sale_price = req.body.sale_price
//   quantity = req.body.quantity
//   category = req.body.category
//   type = req.body.type
// q = "INSERT INTO products VALUES(?,?,?,?,?,?,?,?,?)"
// con.query(q,[id,description,price,sale_price,quantity,file,category,type],(err,rows,fields)=>{
//   if(err) throw err;
// })
// res.redirect("/admin");
//   // console.log(image);

//     });

app.post('/upload', upload.single('image'), (req, res) => {
  //extract form data
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const sale_price = req.body.sale_price;
  const quantity = req.body.quantity;
  const image = req.file.path // path of the uploaded file
  const category = req.body.category;
  const type = req.body.type;

  //insert data into products table
  const query = `INSERT INTO products (id, name, description, price, sale_price, quantity, image, category, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  con.query(query, [id, name, description, price, sale_price, quantity, image, category, type], (error, results) => {
    if (error) {
      //handle error
      console.log(error);
    } else {
      //success
      res.render('pages/admin');
    }
  });
});







app.get('/aboutus', (req, res) => {
  res.render('pages/aboutus');
});

// app.use('/products/:name', express.static(__dirname + '/static/newroute'))

// app.get('/newroute', (req, res) => {
//   res.sendFile(__dirname + '/static/newroute/product.css')
// });


app.get('/products/:id', (req, res) => {
  // console.log("From prudct/ ids");
  var productId = req.params.id;

  // console.log(res);
  con.query(`SELECT price, image, name, description, category FROM products WHERE id = '${productId}'`, (err, result) => {
    if (err) throw err;
    console.log("productSingle=",result, result[0]);
    var productS = result[0];

    const product = [];
    // result.forEach((results) => {
      // var base64Img = new Buffer.from(productS.image, 'binary').toString('base64');
      var base64Img = productS.image;
      product.push({ price: productS.price, name: productS.name, id: productS.id, description: productS.description, category: productS.category, base64Img });

    var productSingle = product[0];
  //   console.log("++++++++++++++++++++++++++");
  //   // console.log(result);
  //   console.log("++++++++++++++++++++++++++");
  // res.sendFile(__dirname + '/static/newroute/product.css');
    res.render('pages/products', {productSingle: productSingle });
  
  });




});


// app.get('/' ()=>{})
// app.get('/home')
// app.get('/index')
// function homePg(req, res) {
// }

app.get('/', function (req, res) {
  console.log("Came to this");
  con.query("SELECT price, image, name, id, description , category FROM products", (err, result) => {
    console.log({ result });
    if (err) throw err;
    const images = [];
    result.forEach((results) => {
//       var base64Image = new Buffer.from(results.image, 'binary').toString('base64');
      var base64Image = results.image;
      images.push({ price: results.price, name: results.name, id: results.id, description: results.description, category: results.category, base64Image });
      const limitedItems = images.slice(0, 3);
      console.log(result);
      console.log("connection created");
    });
    res.render('pages/index', { images: images });
    app.get('/product', (reqq, ress) => {
      ress.render('pages/product', { images: images });
    });
    // app.get('/products/:id', (req, res) => {
    //   // Retrieve product data from database

    //   const productName = req.params.id;
    //   console.log(productName);
    //   console.log(images);
    //   var product = images.filter(function (item) {
    //     console.log(product);
    //     return item.id == productName;

    //   })
    //   var productClicked = product[0];

    //   // Query the database for the product
    //   // const sqll = `SELECT name,description,price FROM products WHERE name = '${productName}'`;
    //   // con.query(sqll, function (err, result) {
    //   //   if (err) throw err;
    //   //   var product = result[0];
    //   //   console.log(result[0]);
    //   // Render the template and pass in the product data

    //   res.render('pages/products', { productClicked: productClicked });

    // });
  });
});
// app.listen(port);
app.listen(PORT);
