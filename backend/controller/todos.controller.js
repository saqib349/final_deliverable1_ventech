import Todo from "../models/todos.model.js";

export async function addTodo(req, res) {
    try {
        const userId = req.user._id
        const { title, completed } = req.body
        const result = await Todo.create({
            userId,
            title,
            completed,

        })
        console.log(result)
        return res.status(201).json({
            data: result
        })
        
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}

export async function deleteTodo(req, res) {
    try {
        const _id = req.params.id
        const todo =await Todo.findByIdAndDelete(_id)
        console.log(todo)
        if (!todo) {
            return res.status(404).json({
                message: "todo not found with this id"
            })
        }
        return res.status(200).json({
            data:todo
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }

}

export async function updateTodo(req, res) {
    try {
        const { title, completed } = req.body;
        const _id = req.params.id;

        const todo = await Todo.findByIdAndUpdate(
            _id,
            { title, completed },
            { returnDocument: 'after' }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found with this id"
            });
        }

        return res.status(200).json({
            data: todo
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

// export async function getTodos(req, res) {
//     try {
//         const result = await Todo.find({userId:req.user._id});
//         res.json({
//             data: result
//         })

//     } catch (err) {
//         res.json({
//             message: err.message
//         });
//     }
// }

// with pagination
export async function getTodos(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const todos = await Todo.find({userId:req.user._id})
            .skip(skip)
            .limit(limit);

        const totalTodos = await Todo.countDocuments({
            userId:req.user._id
        });

        const totalPages = Math.ceil(totalTodos / limit);

        res.json({
            data: todos,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalTodos,
                totalPages
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export async function searchTodo(req, res) {
    try {
        const searchTerm = req.query.searchTerm?.trim();

        if (!searchTerm) {
            return res.status(400).json({
                message: 'Search term is required'
            });
        }

        const todos = await Todo.find({
            userId:req.user._id,
            title: {
                $regex: searchTerm,
                $options: 'i'
            }
        });

        res.status(200).json({
            data: todos
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

