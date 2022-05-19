import retry from "async-retry";
import { createPool, RowDataPacket } from "mysql2/promise";
import {
  EventId,
  EventItem,
  IEventsRepository,
} from "../../domain/ports/IEventsRepository";

const TABLE_NAME = "events";
const COLUMN_ID = "id";
const COLUMN_NAME = "name";
const COLUMN_DESCRIPTION = "description";

export class MySqlEventsRepository implements IEventsRepository {
  async addEvent(name: string, description: string): Promise<EventId> {
    console.log("CALL ADD");
    const connection = await this.getConnection();
    const [row] = await connection.query(
      `
    INSERT INTO ${TABLE_NAME} (${COLUMN_NAME}, ${COLUMN_DESCRIPTION})
    VALUES (?, ?);
    `,
      [name, description]
    );
    await connection.release();

    return (row as any).insertId.toString();
  }

  async getEvent(eventId: EventId): Promise<EventItem> {
    console.log("CALL GET");
    const connection = await this.getConnection();
    const [rows] = await connection.query(
      `
    SELECT * FROM ${TABLE_NAME}
    WHERE ${COLUMN_ID} = ${eventId};
    `
    );
    await connection.release();

    const rowDataPacketArray = rows as RowDataPacket[];
    if (rowDataPacketArray.length === 0) {
      return undefined;
    } else {
      const item = rowDataPacketArray[0];
      return {
        id: item[COLUMN_ID],
        name: item[COLUMN_NAME],
        description: item[COLUMN_DESCRIPTION],
      };
    }
  }

  async initialize(): Promise<void> {
    const connection = await this.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        ${COLUMN_ID} INT NOT NULL UNIQUE AUTO_INCREMENT,
        ${COLUMN_NAME} VARCHAR(255) NOT NULL,
        ${COLUMN_DESCRIPTION} VARCHAR(255) NOT NULL,
        PRIMARY KEY (${COLUMN_ID})
        ) ENGINE=InnoDB;
        `);
    connection.release();
  }

  private getConnection() {
    const pool = createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    return retry(async () => await pool.getConnection());
  }
}
