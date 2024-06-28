import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  // ObjectId;
});

const Task = mongoose.model('Task', taskSchema);

export default Task;