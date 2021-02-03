require('./../db/mongoose');
const User = require('./../models/user');

const updateUserAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age});
    const count = await User.countDocuments({age});
    return count;
}

updateUserAndCount('5fc33bd2d51b873a30d344d2', 25).then(count => {
    console.log(count);
}).catch(e => {
    console.log(e);
})
