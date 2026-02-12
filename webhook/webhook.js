import express from 'express';

const router = express.Router();

router.post('/test', (req, res) => {
  console.log("Github Webhook Received");
    console.log(req.body);;
    res.status(200).send({ message: 'Webhook received successfully'})
        res.json({ received: true });
});

export default router;