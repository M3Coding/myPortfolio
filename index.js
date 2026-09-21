import express from 'express';
import bodyParser from 'body-parser';
import "dotenv/config";
import FormData from "form-data";
import Mailgun from "mailgun.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const mailgun = new Mailgun(FormData);
const mg =mailgun.client({
    username: 'api',
    key:process.env.MAILGUN_API_KEY
});


app.get("/", (req, res) => {
    res.render("index.ejs");
})
app.get("/home", (req, res) => {
    res.render("home.ejs");
})

app.get("/thank-you", (req, res) => {
    res.send("Your appointment request has been sent successfully!")
})
app.get("/resume", (req, res) => {
    res.render("resume.ejs");
})
app.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
})

app.post("/api/send-email", async (req, res) => {
    const name = req.body.name;
    const email =req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;

    const emailData = {
        from: `codinglifecorp@gmail.com`,
        to: "codinglifecorp@gmail.com",
        subject: `New Form Submission from ${name}`,
        text: `Recieved a new submission: \n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nInquiry: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Inquiry:</strong> ${message}</p>`

    };
    try {
        await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);
        return res.send("✅ Your resquest has been sent successfully!");
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, error: 'Internal server error'})
    }

})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

