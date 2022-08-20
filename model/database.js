const mongoose = require('mongoose');

const url = 'mongodb://localhost/usersdb'

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
  })
  .then( ()=> console.log('Conected to mongo'))
  .catch( (e)=> console.log('error' + e))
 
const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    }
});


const UsersModel = mongoose.model('users', usersSchema)

module.exports = UsersModel;