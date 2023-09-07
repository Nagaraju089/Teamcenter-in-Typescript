import { Request, Response } from 'express'
import * as db from '../databases/mysqlDB'
import { getKey } from '../databases/redisDB'
import { mysqlconn } from '../databases/mysqlDB'
import { QueryTypes } from 'sequelize'

export async function getClients(req: Request, res: Response) {
  try {
    let query = `SELECT tc.client_id, tc.client_name, (SELECT count(client_id) FROM teamcenter123.products as tp WHERE tp.client_id = tc.client_id) as no_of_products, tc.created_At, tc.created_By FROM teamcenter123.clients as tc`;
    let object = mysqlconn()!
    object.query(`${query}`, {
      type: QueryTypes.SELECT
    }).then((results: any) => {
      res.send({ status: 1, data: results });
    });

  } catch (error) {
    console.error('Failed to fetch clients:', error);
    res.status(500).json({ message: 'Failed to fetch clients.' });
  }
}

export async function addClients(req: Request, res: Response) {
  try {

    let token = req.headers.authorization?.split(' ')[1];
    let data = await getKey(token);
    let redisValue = JSON.parse(data as string);


    const { client_name } = req.body;

    const user_id = redisValue.userData.user_id;
    if (user_id) {

      const client = await db.getModels().clients.create({

        client_name,
        created_At: Date.now(),
        created_By: user_id
      });
      res.status(200).json({
        message: 'success',
        client
      });
    }

    else {
      res.status(200).send({
        status: 0,
        message: "User not found",
      })
    }
  } catch (error) {
    console.error('Failed to add client:', error);
    res.status(500).json({ message: 'Failed to add client.' });
  }
}
