const express = require('express');
const router = express.Router();
const fetchuser = require('../middlewear/fetchuser');
const Transactions = require('../models/Transaction');
const Categories = require('../models/Categories');
const { body, validationResult } = require('express-validator');

// Route 1: Get all the transactions with Login

router.get('/fetchalltransactions', fetchuser, async (req, res) => {
    const alltransactions = await Transactions.find({ userId: req.user.id });
    if(alltransactions)
    {
        res.json({success:true,alltransactions});
    }else{
        res.json({success:false,alltransactions});
    }
    
})

router.post('/addtransaction', fetchuser, [
    body('type', 'Enter a valid type').isLength({ min: 3 }),
    body('amount', 'Enter a valid amount').isNumeric(),
    body('description', 'Enter a valid description').optional(),  
    body('tag', 'Enter a valid tag').optional(),  
    body('category', 'Enter a valid category').isLength({ min: 3 }),
    body('date', 'Enter a valid date').isISO8601()  
], async (req, res) => {

    try {
        const { type, amount, date, category, description, tag } = req.body;

        // Validate input data
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        // Create a new transaction
        const new_transaction = new Transactions({
            type,
            amount,
            date: new Date(date),  // Convert the date string to a Date object
            category,
            description,
            tag,
            userId: req.user.id
        });

        // Save to database
        const savedTransaction = await new_transaction.save();

        // Return the saved transaction as a response
        res.json(savedTransaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Some error occurred");
    }
});



router.delete('/deletetransaction/:id', fetchuser, async (req, res) => {
    try {
        let transaction = await Transactions.findById(req.params.id);
        if (!transaction) {
            return res.status(404).send("transaction Note Found");
        }

        if (transaction.userId.toString() !== req.user.id) {
            return res.status(401).send("Not allowed to delete");
        }

        let isDeleted = await Transactions.findByIdAndDelete(req.params.id);

        res.json({ "succes": "Your transaction deleted successfully", transaction: isDeleted });

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Some Error occured");
    }
})


router.put('/updatetransaction/:id', fetchuser, async (req, res) => {
    const { type,amount,category, description, tag } = req.body;

    const new_transaction = {};
    if (type) { new_transaction.type = type }
    if (amount) { new_transaction.amount = amount }
    if (category) { new_transaction.category = category }
    if (description) { new_transaction.description = description }
    if (tag) { new_transaction.tag = tag }
    try {
        let transaction = await Transactions.findById(req.params.id);
        if (!transaction) {
            return res.status(404).send("Not Found");
        }

        if (transaction.userId.toString() !== req.user.id) {
            return res.status(404).send("Not Allowed");
        }
        response = await Transactions.findByIdAndUpdate(req.params.id, { $set: new_transaction }, { new: true })
        res.json({ response });

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Some Error occured");
    }

})




module.exports = router