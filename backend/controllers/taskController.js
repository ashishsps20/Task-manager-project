import Task from "../models/taskModel.js";

//CREATE A NEW TASK
export const createTask = async (req, res) => {
  const { title, description,priority,deuDate,completed } = req.body;
  try {
    const task = new Task({
      title,
      description,
      priority,
      deuDate,
      completed: completed ==='yes' || completed === true,
      owner : req.user.id
    });

    const saved = await task.save();
    res.status(201).json({
      success: true,
      task: saved,
    });
  }
  catch(error){
    res.status(400).json({success: false, message: error.message});
  }
};

// GET ALL TASK FOR LOGGED IN USER
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET A SINGLE TASK BY ID
export const getTaskById = async (req, res) => {
  try{
    const task  = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({
      success: true,task});
  }
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE  A TASK
export const updateTask = async (req, res) => {
  try {
    const data = {...req.body};
    if(data.completed !== undefined) {
      data.completed = data.completed === 'yes' || data.completed === true;
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      data,
      { new: true, runValidators: true }
    );

    if(!updated) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      task: updated,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE A TASK
export const deleteTask = async (req, res) => {
  try{
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch(error) {
    res.status(500).json({ success: false, message: error.message });
  }
};