const   mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    resetPasswordToken: {type: String, required: true},
    expire: {type: Date, required: true}
});


module.exports = mongoose.model("resetPassword", resetPasswordSchema);