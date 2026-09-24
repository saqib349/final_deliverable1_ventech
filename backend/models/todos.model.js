import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },

    dueDate: {
        type: Date,
        default: null
    },

    completed: {
        type: Boolean,
        required:true
    }
});

const Todo = mongoose.model("todo", todoSchema);

export default Todo;