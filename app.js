const { Int32, ObjectId } = require('bson')
var express = require('express')
const { login,insertProduct,getAllProducts,
        deleteProductById,updateProduct,findProductById,searchProductByName } = require('./databaseHandler')
var app = express()

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))

const sessions = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.get('/login',(req,res)=>{
    let landingPage = req.query.destination
    res.render('login')
})
function isLoggedin(req,res,next){
    if(req.session.userid){
        next()
    }else{
        res.redirect('/login')
    }
}
app.get('/needlogin',isLoggedin,(req,res)=>{
    res.end("Well you have loggedin!")
})
app.get('/nologin',(req,res)=>{
    res.end("This page doesn't require login!")
})


app.use(express.urlencoded({extended:true}))
app.post('/user', async (req,res)=>{
    const user = await login(req.body.username,req.body.password)
    if(user){
        let session=req.session;
        session.userid=user.userName
        session.role = user.role
        console.log(req.session)
        res.redirect('/')
    }
    else{
        res.send('Invalid username or password');
    }
})

app.get('/',(req,res)=>{
    session=req.session
    res.render('home',{'userid':session.userid,'role':session.role})
})

app.post('/search',async (req,res)=>{
    const search = req.body.search
    const results = await searchProductByName(search)
    console.log(results)
    res.render('view',{'results':results})
})

app.post('/edit',async (req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picture = req.body.txtPic
    await updateProduct(id, name, price, picture)
    res.redirect('/view')
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    const productToEdit = await findProductById(id)
    res.render('edit',{product:productToEdit})
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/view')
})

app.get('/view',async (req,res)=>{
    const results = await getAllProducts()
    res.render('view',{'results':results})
})

app.post('/new',async (req,res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPic
    let newProduct = {
        name : name,
        price: Number.parseInt(price) ,
        pictureURL: picture
    }
    let newId = await insertProduct(newProduct)
    console.log(newId.insertedId)
    res.render('home')
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Server is running on: ", PORT)
})