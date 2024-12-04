const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const dotenv = require('dotenv');
const verifySecret = require('./verifySecret');

dotenv.config();

const app = express();
app.use(express.json());

const addRecord = async (req , res) => {
  const {userId,productId,count} = req.body;
  if(!userId || !productId || !count){
    return res.status(404).json({error : "All fields required"})
  }
  const record = await prisma.shipping.create({
    data :{
      userId,productId,count
    }
  })
  return res.status(201).json(record)
}

const cancleRecord = async (req,res) => {
  const {shippingId} = req.body;
  if(!shippingId){
    return res.status(404).json({error : "Missing shippingId"})
  }
  const updatedRecord = await prisma.shipping.update({
    where :{id : shippingId},
    data :{status:"cancelled"}
  })
  return res.status(200).json(updatedRecord)
}

const getRecords = async (req, res) => {
  const { userId } = req.query;

  if (userId) {
    try {
      const records = await prisma.shipping.findMany({
        where: { userId: Number(userId) },
      });
      return res.status(200).json(records);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching records for userId" });
    }
  } else {
    try {
      const records = await prisma.shipping.findMany();
      return res.status(200).json(records);
    } catch (err) {
      return res.status(500).json({ error: "Error fetching all records" });
    }
  }
};

app.post('/api/shipping/create' , verifySecret , addRecord);
app.get('/api/shipping/get' ,verifySecret , getRecords)
app.get('/api/shipping/get?userId=id',verifySecret ,getRecords)
app.put('/api/shipping/cancel' , verifySecret , cancleRecord)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
module.exports = app;