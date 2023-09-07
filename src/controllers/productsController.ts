import { Request, Response, NextFunction } from 'express'
import { getKey } from '../databases/redisDB';
import * as db from '../databases/mysqlDB'

export async function assignProductToClient(req: Request, res: Response) {

  try {
    const clientId = parseInt(req.params.clientId);
    const { product_name } = req.body;
    const client = await db.getModels().clients.findByPk(clientId, {

      attributes: ['client_id', 'client_name', 'created_At', 'created_By']
    })

    if (!client) {
      return res.status(200).json({
        status: 0,
        error: 'Client not found'
      });
    }

    let token = req.headers.authorization?.split(' ')[1];

    let data = await getKey(token);
    let redisValue = JSON.parse(data as string);
    const user_name = redisValue.userData.name;


    const product = await db.getModels().products.create({
      product_name,
      client_id: clientId,
      onBoarding_time: new Date(),
      created_By: user_name
    })

    res.status(200).json({
      status: 1,
      message: "success",
      product
    });

  } catch (error) {
    console.error('Failed to assign product:', error);
    res.status(500).json({
      status: 0,
      error: 'Failed to assign product'
    });
  }
}


export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {

    const products = await db.getModels().products.findAll({
      attributes: ['product_id', 'product_name', 'onBoarding_time', 'client_id', 'created_by'],
    });

    res.json({
      status: 1,
      products
    });
  } catch (error) {
    console.error('Failed to retrieve products:', error);
    res.status(500).json({
      status: 0,
      error: 'Failed to retrieve products'
    });
  }
  next();
}

export async function getProductsByClient(req: Request, res: Response, next: NextFunction) {

  const client_id = req.params.client_id;

  try {
    const client = await db.getModels().clients.findByPk(client_id, {
      attributes: ['client_id', 'client_name', 'created_by', 'created_at']
    })

    if (!client) {
      return res.status(200).json({
        status: 0,
        error: 'Client not found'
      });
    }


    const products = await db.getModels().products.findAll({
      where: { client_id: client_id },
      attributes: ['product_id', 'product_name', 'onBoarding_time', 'client_id', 'created_by'],
    });

    res.json({
      status: 1,
      products
    });
  } catch (error) {
    console.error('Failed to retrieve products:', error);
    res.status(500).json({
      status: 0,
      error: 'Failed to retrieve products'
    });
  }
  next();
}


