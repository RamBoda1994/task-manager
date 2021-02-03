const bcrypt = require('bcryptjs');

const password = 'Ramboda@9505';

const hash = async (passcode) => {
    const hashedPassword = await bcrypt.hash(passcode,8);
    const isMatch = await bcrypt.compare(passcode, hashedPassword);
    console.log(passcode);
    console.log(hashedPassword);
    console.log(isMatch);
}

hash(password);