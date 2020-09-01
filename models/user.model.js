const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userName: { type: String, unique: true, required: true },
    gameId:{ type: String},
    gameState:{ type: String},
    userUniqueId:{ type: String},
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);