const bcrypt = require('bcrypt');

//converting passsword into hash
const password  = 'Talha@09316';

bcrypt.hash( password , 10 , ( err , hash ) => {
    if(err){
        console.log(err);
        return;
    }
    else {
        console.log('Hashed password :' , hash)
    }
})

//comparing password with hash

const storedHash = 'hashed_password_from_database';
const userInPassword = 'password_attempt_from _user';

bcrypt.compare( userInPassword , storedHash , ( err , result ) => {
    if(err){
        console.log(err);
    }
    if(result){
        console.log('Password matched');
    }
    else{
        console.log('Password not matched');
    }
} )

