const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const Users = require('../models/UserModel.js');
 
const getUsers = async(req, res) => {
    try {
       
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
 
const Register = async(req, res) => {
     try {
    const { firstName, lastName,email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
   
       const User =  await Users.create({
            firstName:firstName,
            lastName:lastName,
            email: email,
            password: hashPassword
        });
        // res.json({msg: "Registration Successful"});
        const accessToken = jwt.sign({userId:User._id, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        User.accessToken = accessToken;
        res.setHeader('x-access-token', 'Bearer '+ accessToken);
      res.json(accessToken);
        res.status(201).json(User);
    } catch (error) {
        console.log(error);
    }
}
 
const Login = async(req, res) => {
    try {

        const email = req.body;
        const user = await Users.findOne({ email });
        const match = await bcrypt.compare(password,user.password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
      
        const accessToken = jwt.sign({userId:user._id, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1d'
        });
     
       
        res.setHeader('x-access-token', 'Bearer '+ accessToken);
       
        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({msg:"Email not found"});
    }
}
 
const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.updateOne({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}


module.exports ={
    Logout,
    Login,
    Register,
    getUsers
}