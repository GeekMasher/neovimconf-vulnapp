
// https://node-postgres.com/
import pg from "pg";
import RateLimit from 'express-rate-limit';

// Rate limiter
export const limiter = RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// Database connection pool
export const pool = new pg.Pool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
});
// Database client
export const client = await pool.connect();

// Initialize the database with some books
export function init() {
    client.query(
        `CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL
        )`
    );

    // insert some books
    client.query(`SELECT * FROM books`).then((result) => {
        if (result.rowCount === 0) {
            createBook("The Fellowship of the Ring", "J.R.R. Tolkien");
            createBook("The Eye of the World", "Robert Jordan");
            createBook("The Colour of Magic", "Terry Pratchett");
            createBook("The Way of Kings", "Brandon Sanderson");
            createBook("A Game of Thrones", "George R.R. Martin");
        }
    });
}

// Create a book
function createBook(title, author) {
    client.query(`INSERT INTO books (title, author) VALUES ($1, $2)`, [
        title, author
    ]);
}
