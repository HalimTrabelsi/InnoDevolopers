const express = require('express');
const router = express.Router();

router.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
  });
  
  router.post("/tasks", async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  });
  
  router.put("/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  });
  
  router.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  });
  
module.exports = router;
