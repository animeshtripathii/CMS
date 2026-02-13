import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: Webhook endpoints
 */

/**
 * @swagger
 * /webhook/test:
 *   post:
 *     summary: Test webhook endpoint
 *     tags: [Webhook]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook received successfully
 */
router.post('/test', (req, res) => {
  console.log("Github Webhook Received");
    console.log(req.body);;
    res.status(200).send({ message: 'Webhook received successfully'})
        res.json({ received: true });
});

export default router;