const verifySecret = (req,res,next) => {
    // const apiKey = "a1b2c3d4e5f67890123456789abcdef";
    const apiKey = req.headers
    // console.log(JSON.parse(SHIPPING_SECRET_KEY))
    if(!apiKey.shipping_secret_key){
        console.log(apiKey)
        return res.status(403).send({ 
            "error": "SHIPPING_SECRET_KEY is missing or invalid"
         })
    }
    if(apiKey.shipping_secret_key != process.env.SHIPPING_SECRET_KEY){
        return res.status(403).send({ 
            "error": "Failed to authenticate SHIPPING_SECRET_KEY"
         })
    }
    next();
}
module.exports = verifySecret