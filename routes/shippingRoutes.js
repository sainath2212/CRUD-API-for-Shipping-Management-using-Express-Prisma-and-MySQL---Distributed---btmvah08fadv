const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const verifySecret = require('../verifySecret')
const {prisma} = require('../db/config')

router.post('/create',verifySecret,async (req,res)=>{
    const {userId,productId,count} = req.body
    if(!userId || !productId || !count){
        return res.status(404).send({
            "error": "All fields required"
          })
    }
    const product = await prisma.shipping.create({data:{userId,productId,count}})
    return res.status(201).send(product)
});

router.put('/cancel',verifySecret,async (req,res)=>{
    const id = req.body.shippingId
    if(!id){
        return res.status(404).send({ 
            "error": "Missing shippingId", 
        })
    }
    const {userId,productId,count} = await prisma.shipping.findUnique({where:{id:parseInt(id)}})
    const product = await prisma.shipping.update({where:{id:parseInt(id)},data:{id,userId,productId,count,status: "cancelled"}})
    return res.status(200).send({id:product.id,userId:product.userId,productId:product.productId,count:product.count,status:product.status})

});

router.get('/get',verifySecret,async (req,res)=>{
    const products = await prisma.shipping.findMany();
    return res.status(200).send(products)
});

router.get('/shipping/get', verifySecret, async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return sendError(res, "Missing userId query parameter", 400);
        }
        const products = await prisma.shipping.findMany({ where: { userId: parseInt(userId) } });
        return res.status(200).send(products);
    } catch (error) {
        return sendError(res, "Failed to fetch shipping entries for user", 500);
    }
});


module.exports = router
