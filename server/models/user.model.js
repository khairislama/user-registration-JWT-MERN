const   mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    passwordHash: {type: String, required: true},
    firstname: {type: String, required: false},
    lastname: {type: String, required: false},
    userImage: {type: String, default: "userImage-default-vector-avatar-image1541962.jpg"},
    userbio: {type: String, required: false}
});


module.exports = mongoose.model("User", userSchema);