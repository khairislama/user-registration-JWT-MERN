const   mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    uniqueString: {type: String},
    isVerified: {type: Boolean, required: true, default: false},
    passwordHash: {type: String, required: true},
    firstname: {type: String, required: false},
    lastname: {type: String, required: false},
    userImage: {type: String, default: "userImage-default-vector-avatar-image1541962.jpg"},
    userbio: {type: String, required: false}
});


module.exports = mongoose.model("User", userSchema);