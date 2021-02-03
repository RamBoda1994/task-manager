const jwt = require('jsonwebtoken');

const SECRET_KEY = "Nodejscourse";

const user = {
    name: 'Ram',
    age: 26
}

const token = jwt.sign(user, SECRET_KEY, {expiresIn: '1h'});
console.log(token);
const data = jwt.verify(token, SECRET_KEY);
console.log(data);