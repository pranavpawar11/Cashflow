const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ensure this matches the name of your User model
        required: true
    },
    income: {
        type: Map,
        of: Number,
        default: new Map([
            ['Other', 0],
            ['Salary', 0],
            ['Investments', 0],
            ['Gifts', 0]
        ]),
    },
    expense: {
        type: Map,
        of: Number,
        default: new Map([
            ['Other', 0],
            ['Food', 0],
            ['Entertainment', 0],
            ['Travel', 0]
        ]),
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
