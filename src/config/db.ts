// src/config/db.ts
import mysql from 'mysql2/promise';
import EventEmitter from 'events';

class MySQLController extends EventEmitter {
    private pool: mysql.Pool | null = null;

    public async connect() {
        if (this.pool) return this.pool;
        this.pool = mysql.createPool({
            host: 'node53939-belusysdb-1.th1.proen.cloud',
            port: 11320,
            user: 'quizdev_cc',
            password: '8g[MTOF!GY@o9UrS',
            database: 'quizdev_cc',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        const conn = await this.pool.getConnection();
        conn.release();

        this.emit('connected');
        return this.pool;
    }

    public getPool() {
        if (!this.pool) throw new Error('Database not connected');
        return this.pool;
    }
}

const db = new MySQLController();

db.connect().catch(err => console.error('DB Connect Error:', err));

export default db;
