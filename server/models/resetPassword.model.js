const   mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resetPasswordToken: {type: String, required: true},
    expire: {type: Date, required: true}
});


module.exports = mongoose.model("resetPassword", resetPasswordSchema);