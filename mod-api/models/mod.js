const mongoose = require('mongoose');

const modSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    filePath: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mod', modSchema);
