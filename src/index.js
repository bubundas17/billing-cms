import { join } from 'path';

import express from "express";
import mongoose from 'mongoose';
import { create } from 'express-handlebars';

import routes from "./routes";

const hbs = create({
    extname: 'hbs',
    defaultLayout: 'main',
});

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.render("index");
});

app.use(routes);

app.listen(3000, async () => {
    console.log("Server started on port 3000");

    try {
        await mongoose.connect('mongodb://localhost/tsnode');
        console.log("Database connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})