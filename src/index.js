
import 'dotenv/config'
import express from 'express';
import cors from 'cors';

import { init, client, limiter } from './setup.js';

// main express app
const app = express()
app.use(cors());
app.use(limiter);

app.get('/', (req, res) => {
    const name = req.query.name || 'World';

    console.log(`Name: ${name}`);

    res.send(`Hello ${name}!`);
})

app.get('/api/books', (req, res) => {
    console.log("Get all books");
    var query = "SELECT * FROM books";
    var params = [];

    if (req.query.author) {
        query += ` WHERE author='${req.query.author}'`;
        // query += ` WHERE author=$1`;
        // params.push(req.query.author);
    }
    else if (req.query.title) {
        query += ` WHERE title='${req.query.title}'`;
    }

    const results = client.query(query, params);

    results.then((result) => {
        res.json({ "data": result.rows, "count": result.rowCount });
    }).catch((err) => {
        res.json({ "error": err });
    })
})


app.listen(process.env.PORT, () => {
    // initialize the database
    init();
    console.log(`App listening on port: ${process.env.PORT}`)
})

