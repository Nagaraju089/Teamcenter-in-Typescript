
import { Request, Response, NextFunction } from 'express'
import { getKey } from '../databases/redisDB'
import { Mongodbclient } from '../databases/mongoDB'
import * as db from '../databases/mysqlDB'
import path from 'path'

let currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-IN');
const formattedTime = currentDate.toLocaleTimeString('en-IN');

export async function uploadDocs(req: Request, res: Response, next: NextFunction) {
  try {
    const { document_type, version } = req.body;
    const clientId = req.params.clientId;
    const productId = req.params.productId;

    const client = await db.getModels().clients.findByPk(clientId);
    if (!client) {
      res.send({
        status: 0,
        message: "Client not found"
      });
    }

    const product = await db.getModels().products.findByPk(productId);
    if (!product) {
      res.send({
        status: 0,
        message: 'Product not found'
      })
    }

    let token = req.headers.authorization?.split(' ')[1];
    let data = await getKey(token);
    let redisValue = JSON.parse(data as string);
    const user_id = redisValue.userData.user_id;
    const user_name = redisValue.userData.name;
    const user = await db.getModels().users.findByPk(user_id, {
      attributes: ['user_id', 'name', 'email']
    });

    if (!user) {
      return res.status(200).json({
        status: 0,
        error: 'User not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 0,
        error: 'No file uploaded'
      });
    }

    let docPath = '';

    if (req.file.mimetype.startsWith('image/')) {
      docPath = `/photos/${user_id}_${req.file.originalname}`;
    } else if (req.file.originalname.endsWith('.zip')) {
      docPath = `/firmware/${clientId}_${clientId}_${req.file.originalname}`;
    }
    else if (req.file.originalname.endsWith('.apk')) {
      docPath = `/Apks/${clientId}_${clientId}_${req.file.originalname}`;
    }
    else if (req.file.originalname.endsWith('.txt')) {
      docPath = `/textFiles/${clientId}_${productId}_${req.file.originalname}`;
    }
    else {
      res.send({
        message: 'Invalid filetype'
      })
    }

    // Save the uploaded file to the documents table
    await db.getModels().documents.create({

      document_type,
      version,
      client_id: clientId,
      product_id: productId,
      released_date: formattedDate,
      released_by: user_name,
      file_path: docPath,
      user_id: user_id

    });

    // Save the uploaded file to MongoDB
    const mongodb = Mongodbclient.db('Teamcenter');
    const collection = mongodb.collection('recents123');
    const result = await collection.insertOne({
      filename: req.file.filename,
      data: `Latest ${document_type} is uploaded by ${user_name}`,
      document_type: `${document_type}`,
      version: `${version}`,
      Date: formattedDate,
      Time: formattedTime
    });

    res.send({
      status: 1,
      success: true, result
    });


  } catch (error) {
    console.error('Failed to upload firmware:', error);
    res.status(500).json({
      status: 0,
      error: 'Failed to upload firmware'
    });
  }
}

export async function getDocuments(req: Request, res: Response, next: NextFunction) {

  const client_Id = req.params.clientId
  const product_Id = req.params.productId;

  const client = await db.getModels().clients.findByPk(client_Id, {
    attributes: ['client_id', 'client_name', 'created_by', 'created_at']
  })

  if (!client) {
    return res.status(200).json({
      status: 0,
      error: 'Client not found'
    });
  }

  const product = await db.getModels().products.findByPk(product_Id);
  if (!product) {
    res.send({
      status: 0,
      message: 'Product not found'
    })
  }

  let data = await db.getModels().documents.findAll({
    where: {
      client_id: client_Id,
      product_id: product_Id

    },

    attributes: ['document_id', 'document_type', 'released_date', 'released_by', 'client_id', 'product_id'],

  });
  let obj = data.reduce((prv: any, curr: any) => {
    let keys = Object.keys(prv);
    if (keys.includes(curr.document_type)) {
      prv[curr.document_type].push(curr);
    } else {
      prv[curr.document_type] = [curr];
    }
    return prv;
  }, {});
  res.send({ status: 1, data: data.length > 0 ? obj : [] });
}



export async function recentFiles(req: Request, res: Response, next: NextFunction) {

  const mongodb = Mongodbclient.db('Teamcenter');
  const collection = mongodb.collection('recents');
  const recentFiles = await collection.find().sort({ Date: -1 }).limit(5).toArray();
  res.send({
    status: 1,
    success: true, recentFiles
  });
  next();
}


export async function downloadFiles(req: Request, res: Response) {

  const docId = req.params.docID;
  const doc = await db.getModels().documents.findByPk(docId, {

    attributes: ['file_path']
  })
  const newPath = doc.file_path;
  console.log(newPath)


  const parts = newPath.split("/");
  console.log(parts);
  const extractedPart = parts[1];
  const extractedName = parts[2];
  var newParts = extractedName.split("_");
  var newFileName = newParts[newParts.length - 1]


  let subfolder = '';
  if (extractedPart === 'firmware') {
    subfolder = 'firmware';
  } else if (extractedPart === 'textFiles') {
    subfolder = 'textFiles';
  } else if (extractedPart === 'apks') {
    subfolder = 'Apks';
  } else {

    return res.status(400).json({
      status: 0,
      error: 'Invalid file type',
    });
  }

  const fileName = path.basename(newPath);
  const finalFilePath = path.join(__dirname, '../public', subfolder, fileName);

  res.download(finalFilePath, newFileName, (err) => {
    if (err) {
      console.error('Failed to download file:', err);
      res.status(500).json({
        status: 0,
        error: 'Failed to download file'
      });
    }
    message: "success"
  });
}















