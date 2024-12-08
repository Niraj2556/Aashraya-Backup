const mongoose = require('mongoose');


let schema = new mongoose.Schema(
    {
        nearLoc : String,
        pname: String, 
        pdesc: String, 
        price: Number, 
        category: String, 
        pimage: String,
        pimage2: String,
        addedBy: mongoose.Schema.Types.ObjectId,
        pLoc : {
            type : {
                type : String,
                enum :['Point'],
                default : 'Point'
            },
            coordinates : {
                type : [Number]
            }
        }
})

schema.index({pLoc : "2dsphere"})

const Products = new mongoose.model('Products', schema);

module.exports.search = (req, res) => {


    let Search = req.query.search;

    let latitude = req.query.loc.split(',')[0]
    let longitude = req.query.loc.split(',')[1]

    Products.find({
        $or: [
            {pname: { $regex: Search }},
            {pdesc: { $regex: Search }},
            {category: { $regex: Search }},
            {nearLoc: { $regex: Search }},
        ],
        pLoc: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates : [parseFloat(latitude), parseFloat(longitude)]
                },
                $maxDistance: 10* 1000,
            }
        }
    })
    .then((result)=>{
        res.send({message : 'success', products : result})
    })
    .catch(()=>{
        alert('server error')
    })
}

module.exports.addProduct = (req,res) =>{

    const nearLoc = req.body.nearLoc;
    const plat = req.body.plat;
    const plong = req.body.plong;
    const pname = req.body.pname;
    const pdesc = req.body.pdesc;
    const price = req.body.price;
    const category = req.body.category;
    const pimage = req.files.pimage[0].path;
    const pimage2 = req.files.pimage2[0].path;
    const addedBy = req.body.userId;

    const product = new Products({nearLoc, pname, pdesc,  price, category, pimage,pimage2, addedBy, pLoc : { type :'Point', coordinates : [plat , plong]
}
});

    product.save()
    .then(()=>{
        res.send({message: "Saved successfully"})
    })
    .catch((err)=>{
        alert('server error')
    })
}

module.exports.editProduct = (req,res) =>{


    const pid = req.body.pid;
    const pname = req.body.pname;
    const pdesc = req.body.pdesc
    const price = req.body.price
    const category = req.body.category


    let pimage = '';
    let pimage2 = '';

    if(req.files && req.files.pimage && req.files.pimage.length > 0){
       pimage = req.files.pimage[0].path
    }
    if(req.files && req.files.pimage2 && req.files.pimage2.length > 0){
        pimage2 = req.files.pimage2[0].path
    }
    // const addedBy = req.body.userId;

//     const product = new Products({pname, pdesc,  price, category, pimage,pimage2, addedBy, pLoc : { type :'Point', coordinates : [plat , plong]
// }
// });

    let editObj = {}

    if(pname){
        editObj.pname = pname
    }
    if(pdesc){
        editObj.pdesc = pdesc
    }
    if(price){
        editObj.price = price
    }
    if(category){
        editObj.category = category
    }
    if(pimage){
        editObj.pimage = pimage
    }
    if(pimage2){
        editObj.pimage2 = pimage2
    }




    Products.updateOne({_id : pid}, editObj , {new : true} )
    .then((result)=>{
        res.send({message: "Saved successfully", products : result})
    })
    .catch((err)=>{
        alert('server error')
    })
}

module.exports.getProduct = (req, res) =>{

    const catName = req.query.catName;

    let _f = { }
    if(catName){
        _f = {category: catName}
    }
    Products.find(_f)
    .then((result)=>{
        res.send({message : 'success', products : result})
    })  
    .catch(()=>{ 
        alert('server error')
    })
}

module.exports.getProductById = (req, res) =>{
    // console.log(req.params.pId, "id")

    Products.findOne( {_id : req.params.pId})
    .then((result)=>{
        res.send({message : 'success', products : result})
    })  
    .catch(()=>{
        alert('server error')
    })
}

module.exports.myProduct = (req, res) =>{


    const userId = req.body.userId;

    Products.find({addedBy : userId})
    .then((result)=>{
        res.send({message : 'success', products : result})
    })  
    .catch(()=>{
        alert('server error')
    })
}



module.exports.deleteProduct = (req, res) =>{
    const userId = req.body.userId;
    const pid = req.body.pid;

    Products.deleteOne({addedBy : userId, _id : pid})
    .then(()=>{
        res.send({message : 'success'})
    })  
    .catch(()=>{
        alert('server error')
    })
}