// ********************* APP CREATED BY KHAIRISLAMA *********************** //
// PACKAGES IMPORTATION
require("dotenv").config();
const   express                     = require("express"),
        bodyParser                  = require("body-parser"),
        mongoose                    = require("mongoose"),
        cookieParser                = require("cookie-parser"),
        cors                        = require("cors"),
        app                         = express();

// BASE CONFIGURATION
//seedDB();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

// DATABASE CONNEXION
const   APP_PORT = process.env.APP_PORT || 3001;
const   DATA_BASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/enter_ure_db_name_here"
mongoose.connect(
    DATA_BASE_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    }, (err)=>{
        if (err) return console.error(err)
        console.log(`connected to MongoDB`);
    }
    );

app.use("/api/auth", require("./routes/auth.routes"));

// SERVER STARTER
app.listen(APP_PORT, ()=>{
    console.log(`Server started and listening on port ${APP_PORT}`);
});