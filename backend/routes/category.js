const express = require('express');
const router = express.Router();
const fetchuser = require('../middlewear/fetchuser');
const Categories = require('../models/Categories');
const { body, validationResult } = require('express-validator');


// Fetch all categories for the logged-in user
router.get('/fetchallcategories', fetchuser, async (req, res) => {
    try {
        const allcategories = await Categories.find({ userId: req.user.id });
        if (allcategories.length > 0) {
            res.json({ success: true, allcategories });
        } else {
            res.json({ success: false, msg: "No categories found" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Some error occurred");
    }
});

// Add a new category for the logged-in user
router.put('/addcategory', fetchuser, [
    body('category', 'Category is required').not().isEmpty(),
    body('type', 'Type is required').isIn(['income', 'expense']),
    body('limit', 'Limit must be a number').optional().isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { category, type, limit = 0 } = req.body;
    try {
        let categories = await Categories.findOne({ userId: req.user.id });
        if (!categories) {
            categories = new Categories({ userId: req.user.id });
        }

        if (type === 'expense') {
            if (categories.expense.has(category)) {
                return res.json({ success: false, msg: "Category already exists" });
            }
            categories.expense.set(category, limit);
        } else if (type === 'income') {
            if (categories.income.has(category)) {
                return res.json({ success: false, msg: "Category already exists" });
            }
            categories.income.set(category, limit);
        }

        await categories.save();
        res.json({ success: true, msg: "Category added successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Some error occurred");
    }
});

// Delete a category for the logged-in user
router.delete('/deletecategory', fetchuser, [
    body('category', 'Category is required').not().isEmpty(),
    body('type', 'Type is required').isIn(['income', 'expense'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { category, type } = req.body;
    try {
        const categories = await Categories.findOne({ userId: req.user.id });
        if (!categories) {
            return res.status(404).send("Not Found");
        }

        if (type === 'expense') {
            if (!categories.expense.has(category)) {
                return res.json({ success: false, msg: "Category does not exist" });
            }
            categories.expense.delete(category);
        } else if (type === 'income') {
            if (!categories.income.has(category)) {
                return res.json({ success: false, msg: "Category does not exist" });
            }
            categories.income.delete(category);
        }

        await categories.save();
        res.json({ success: true, msg: "Category deleted successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Some error occurred");
    }
});

// Update a category based on name and budget limit
router.put('/updatecategory', fetchuser, [
    body('category', 'Current category name is required').not().isEmpty(),
    body('newLimit', 'New limit must be a number').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { category, newLimit } = req.body;
    try {
        const categories = await Categories.findOne({ userId: req.user.id });
        if (!categories) {
            return res.status(404).send("Categories not found");
        }

        let updated = false;

        // Update expense category limit
        if (categories.expense.has(category)) {
            categories.expense.set(category, newLimit);
            updated = true;
        }

        // Update income category limit
        if (categories.income.has(category)) {
            categories.income.set(category, newLimit);
            updated = true;
        }

        if (updated) {
            await categories.save();
            res.json({ success: true, msg: "Category limit updated successfully" });
        } else {
            res.json({ success: false, msg: "Category not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Some error occurred");
    }
});

module.exports = router