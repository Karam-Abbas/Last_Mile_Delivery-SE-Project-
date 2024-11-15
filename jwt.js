const jwt = require('jsonwebtoken')

// jwtAuthMiddleware is passed into routes to make sure that token is required to access those paths
const jwtAuthMiddleware = (req,res,next) =>{
    //Check for the authorization header 
    const authoriztaion = req.headers.authorization
    if(!authoriztaion) return res.status(401).json({error: 'Token not found'})
    //Extract jwt token from the request header
    //and also extracting token using split(' ')[1] by space so we get token only
    const token = req.headers.authorization.split(' ')[1]
    if(!token)  return res.status(401).json({error:"Unauthorized"})
    //if token found
    try {
         
        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        req.customerPayload = decoded
         
        next();
    } catch (error) {
        console.error(error)
        res.status(401).json({error:'Inavlid Token'})
    }
}

//Function to generate JWT Token
const generateToken = (userData) => {
    //it requires userData(payload) to generate JWT Token
    return jwt.sign(userData, process.env.JWT_SECRET)

}
module.exports = {jwtAuthMiddleware, generateToken};