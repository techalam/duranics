var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
const multer = require("multer");
const session = require('express-session');
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


app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: false
}));


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


 app.get('/products/:id', (req, res) => {
  // console.log("From prudct/ ids");
  var productId = req.params.id;

  // console.log(res);
  con.query(`SELECT price, image1, image2, image3, name, description, category FROM products WHERE id = '${productId}'`, (err, result) => {
    if (err) throw err;
    console.log("productSingle=",result, result[0]);
//     var product = images.filter(image =>{
//     return image.id == productId;
//     })
        var productS = result[0];

    const product = [];
    // result.forEach((results) => {
      // var base64Img = new Buffer.from(productS.image, 'binary').toString('base64');
      var base64Img1 = productS.image1;
      var base64Img2 = productS.image2;
      var base64Img3 = productS.image3;
//       var base64Img = base64Img1.substring(8);
      product.push({ price: productS.price, name: productS.name, id: productS.id, description: productS.description, category: productS.category, base64Img1, base64Img2, base64Img3 });

    var productSingle = product[0];
  //   console.log("++++++++++++++++++++++++++");
  //   // console.log(result);
  //   console.log("++++++++++++++++++++++++++");
  // res.sendFile(__dirname + '/static/newroute/product.css');
    res.render('pages/products', {productSingle: productSingle });
  
  });




});


app.get('/enquiry', (req, res) => {
  res.render('pages/enquiry');
});
app.get('/admin', (req, res) => {
  if (!req.session.authenticated) {
    res.redirect('/login');
    return;
  }

  // render the admin page here
  res.send('Admin Page');
});

app.get('/login', (req, res) => {
  res.send(`
  <script src="https://cdn.tailwindcss.com"></script>

    <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form method="POST" action="/login" class="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                      <input name="username" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your username" required="">
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                  </div>
                  <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>

                  <div class="mb-4" style="width: 50%; margin: auto;">
                  <button class="shadow appearance-none border rounded w-full py-2 px-3 text-blue-700 leading-tight focus:outline-none focus:shadow-outline" id="submit" name="submit" type="submit">submit</button>
                </div>

              </form>
          </div>
      </div>
  </div>
</section>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // check username and password here (e.g., by querying a database)
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true;
    res.render('pages/admin');
  } else {
    res.send('Invalid username or password');
  }
});

app.post('/submit', (req, res) => {
  const sql = "INSERT INTO enquiry('name','email','message') values ('" + req.body.name + "','" + req.body.email + "','" + req.body.message + "')";
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

app.post('/upload', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), (req, res) => {
  //extract form data
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const sale_price = req.body.sale_price;
  const quantity = req.body.quantity;
  const imagePath1 = req.files['image1'][0].path; // path of the uploaded file
  const imageBinary1 = fs.readFileSync(imagePath1);
  const image1 = new Buffer.from(imageBinary1).toString('base64');
  const imagePath2 = req.files['image2'][0].path; // path of the uploaded file
  const imageBinary2 = fs.readFileSync(imagePath2);
  const image2 = new Buffer.from(imageBinary2).toString('base64');
  const imagePath3 = req.files['image3'][0].path; // path of the uploaded file
  const imageBinary3 = fs.readFileSync(imagePath3);
  const image3 = new Buffer.from(imageBinary3).toString('base64');
  const category = req.body.category;
  const type = req.body.type;

  //insert data into products table
  const query = `INSERT INTO products (id, name, description, price, sale_price, quantity, image1, category, type, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  con.query(query, [id, name, description, price, sale_price, quantity, image1, category, type, image2, image3], (error, results) => {
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




// app.get('/' ()=>{})
// app.get('/home')
// app.get('/index')
// function homePg(req, res) {
// }

app.get('/', function (req, res) {
  console.log("Came to this");
  con.query("SELECT price, image1, name, id, description , category FROM products", (err, result) => {
    console.log({ result });
    if (err) throw err;
    const images = [];
    result.forEach((results) => {
//       var base64Image = new Buffer.from(results.image, 'binary').toString('base64');
      var base64Image = results.image1;
      images.push({ price: results.price, name: results.name, id: results.id, description: results.description, category: results.category, base64Image });
      const limitedItems = images.slice(0, 3);
      console.log(result);
      console.log("connection created");
    });
    res.render('pages/index', { images: images });
    
  });
});

app.get('/product', (reqq, ress) => {
  con.query("SELECT price, image1, name, id, description , category FROM products", (err, result) => {
    console.log({ result });
    if (err) throw err;
    const images = [];
    result.forEach((results) => {
//       var base64Image = new Buffer.from(results.image, 'binary').toString('base64');
      var base64Image = results.image1;
      images.push({ price: results.price, name: results.name, id: results.id, description: results.description, category: results.category, base64Image });
      const limitedItems = images.slice(0, 3);
      console.log(result);
      console.log("connection created");
    });
  ress.render('pages/product', { images: images });
  
});
});
// app.listen(port);
app.listen(PORT);
