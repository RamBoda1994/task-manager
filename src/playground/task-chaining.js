require('./../db/mongoose');
const Task = require('./../models/task');

const deleteTaskAndCount = async (id, completed) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed});
    return count;
} 

deleteTaskAndCount('5fc3452fc1169b4a48075633', false).then(count => {
    console.log(count);
}).catch(e => {
    console.log(e);
})