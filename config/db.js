const mogoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });


const connectDB = async () => {
    try {
        await mogoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    } catch (error) {
        process.exit(1);
    }
}


module.exports = connectDB;
