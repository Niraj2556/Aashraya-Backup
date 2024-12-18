const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')


const Users = new mongoose.model('Users', {
    username: String, 
    mobile: Number,
    email: String,  
    password: String,
    likedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products'}]
})


module.exports.likeProduct = (req, res) => {
    const userId = req.body.userId
    const productId = req.body.productId;

    Users.updateOne({_id: userId},{$addToSet: { likedProducts: productId }})
    .then(()=>{
        res.send({message: "Wishlisted successfully"})
    })
    .catch((err)=>{
        res.send({ message: 'server err' })
    })
}


module.exports.dislikeProduct = (req, res) => {
    const userId = req.body.userId
    const productId = req.body.productId;

    Users.updateOne({_id: userId},{$pull: { likedProducts: productId }})
    .then(()=>{
        res.send({message: "Removed successfully"})
    })
    .catch((err)=>{
        res.send({ message: 'server err' })
    })
}

module.exports.signUp = (req, res) =>{
    const username = req.body.username; 
    const password = req.body.password;
    const email = req.body.email;
    const mobile = req.body.mobile;
    
    const user = new Users({username: username, password: password, email: email, mobile: mobile})
    user.save().then(()=>{
        res.send({message: "User Created successfully"})
    }).catch((err)=>{
        res.send({ message: 'server err' })
    })
}

module.exports.myProfileById = (req, res) =>{
    const uid = req.params.userId;

    Users.findOne({_id : uid})
    .then((result)=>{
        res.send({message : 'success', user : {email : result.email, mobile : result.mobile, username : result.username}})
    })  
    .catch(()=>{
        alert('server error')
    })
}

module.exports.getUserById = (req, res) =>{
    const _userId = req.params.uId;
    Users.findOne({_id : _userId})
    .then((result)=>{
        res.send({message : 'success', user : {email : result.email, mobile : result.mobile, username : result.username}})
    })  
    .catch(()=>{
        res.send({ message: 'server err' })
    })
}



module.exports.login = (req, res) =>{
    const username = req.body.username; 
    const password = req.body.password;

    Users.findOne({username: username})
    .then((result)=>{
        if(!result){
            res.send({message: "User not found"})
        }else{
            if(result.password === password){
                const token = jwt.sign({
                    data : result
                }, 'MYKEY', {expiresIn : '1h'})
                res.send({message: "Login Success", token : token, userId: result._id })
        } 
        if(result.password !== password){
            res.send({message: "Password not matched"})
        }
    }
    }).catch(()=>{
        res.send({ message: 'server err' })
    })
}

module.exports.likedProduct = (req, res) =>{
    Users.findOne({_id : req.body.userId}).populate('likedProducts')
    .then((result)=>{
        res.send({message : 'success', products : result.likedProducts})
    })  
    .catch((err)=>{
        res.send({ message: 'server err' })
    })
}