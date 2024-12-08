const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());
const jwt = require('jsonwebtoken')

  



const productController = require('./controllers/productController')
const userController = require('./controllers/userController')  


const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })




const mongoose = require('mongoose');
const { likeProducts } = require('./controllers/userController');
mongoose.connect('mongodb://localhost:27017/aashraya');

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use('/uploads', express.static(path.join(__dirname,'uploads' )));



app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/search', productController.search)
app.post('/like-product', userController.likeProduct)
app.post('/dislike-product', userController.dislikeProduct )
app.post('/add-product', upload.fields([{name: 'pimage'}, {name: 'pimage2'}]), productController.addProduct)
app.post('/edit-product', upload.fields([{name: 'pimage'}, {name: 'pimage2'}]), productController.editProduct)
app.get('/get-products', productController.getProduct)
app.post('/delete-product', productController.deleteProduct)
app.get('/get-product/:pId', productController.getProductById)
app.post('/liked-products', userController.likedProduct)
app.post('/my-product', productController.myProduct)
app.post('/signup', userController.signUp)
app.get('/my-profile/:userId', userController.myProfileById)
app.post('/login', userController.login)
app.get('/get-user/:uId', userController.getUserById)




app.listen(PORT, ()=>{
    console.log("App is running on port 4000")
})