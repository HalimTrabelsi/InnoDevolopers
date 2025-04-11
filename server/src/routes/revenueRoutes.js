const express = require('express');
const router = express.Router();
const { Revenue } = require('../models/revenue');

// Create Revenue
router.post('/revenue', async (req, res) => {
  try {
    const revenue = new Revenue(req.body);
    await revenue.save();
    res.status(201).json(revenue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Revenue
router.get('/revenue', async (req, res) => {
  try {
    const revenues = await Revenue.find().populate('createdBy', 'name email');
    res.status(200).json(revenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Revenue by ID
router.get('/revenue/:id', async (req, res) => {
  try {
    const revenue = await Revenue.findById(req.params.id).populate('createdBy', 'name email');
    if (!revenue) {
      return res.status(404).json({ message: 'Revenue not found' });
    }
    res.status(200).json(revenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Revenue
router.put('/revenue/:id', async (req, res) => {
  try {
    const revenue = await Revenue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!revenue) {
      return res.status(404).json({ message: 'Revenue not found' });
    }
    res.status(200).json(revenue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Revenue
router.delete('/revenue/:id', async (req, res) => {
  try {
    const revenue = await Revenue.findByIdAndDelete(req.params.id);
    if (!revenue) {
      return res.status(404).json({ message: 'Revenue not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;