import {open} from "sqlite";
import sqlite3 from "sqlite3";

export default async function db() {
    const db = await open({
        filename: './ring.db',
        driver: sqlite3.Database
    });
    return db;
}
