const express = require('express');
const multer = require('multer');
const Mod = require('../models/mod');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Upload mod
router.post('/upload', [auth, upload.single('modFile')], async (req, res) => {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ msg: 'No file uploaded' });

    try {
        const newMod = new Mod({
            title,
            description,
            filePath: `/uploads/${file.filename}`,
            uploadedBy: req.user.id
        });
        await newMod.save();

        res.json({ msg: 'Mod uploaded successfully', mod: newMod });
    } catch (err) {
        res.status(500).json({ msg: 'Error uploading mod' });
    }
});

// Get all mods
router.get('/', async (req, res) => {
    try {
        const mods = await Mod.find().populate('uploadedBy', 'username');
        res.json(mods);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Download mod by ID
router.get('/:id', async (req, res) => {
    try {
        const mod = await Mod.findById(req.params.id);
        if (!mod) return res.status(404).json({ msg: 'Mod not found' });

        res.download(path.join(__dirname, `../${mod.filePath}`));
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
