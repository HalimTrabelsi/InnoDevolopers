const User = require("../models/User");
const { Revenue } = require("../models/revenue");
const Task = require("../models/task"); 
const express = require("express");

// Fetch dashboard data (Revenue + Tasks)
const getDashboardData = async (req, res) => {
    try {
      const revenues = await Revenue.find().populate("createdBy", "name email");
      const tasks = await Task.find();
  
      res.status(200).json({ tasks, revenues }); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Create a new task
const createDashboardData = async (req, res) => {
  try {
    const { title, deadline, priority } = req.body;
    const newTask = new Task({ title, deadline, priority }); 
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData, createDashboardData };
