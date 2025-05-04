import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});

export const executeSQL = async (query: string, values: unknown[] = []) => {
    try {
        const [rows] = await pool.execute(query, values);
        return rows;
    } catch(err) {
        console.error("Database error: ", err);
        throw new Error("Database error");
    }
}