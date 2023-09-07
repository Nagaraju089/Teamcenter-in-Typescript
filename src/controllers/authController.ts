import jwt from 'jsonwebtoken'
import { setKey, getKey, deleteKey } from '../databases/redisDB'
import { Request, Response, NextFunction } from "express";
import randomstring from 'randomstring'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../utility/email'
import * as db from '../databases/mysqlDB'


export async function sendOTP(req: Request, res: Response) {

  const { email } = req.body
  try {

    const user = await db.getModels().users.findOne({
      where: { email: email }
    });

    if (user) {

      const otp = Math.floor(100000 + Math.random() * 900000);
      const randomString = randomstring.generate() + new Date().getTime().toString();
      const scode = bcrypt.hashSync(randomString, 10)

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Your OTP for Login',
        html: `<h1>Welcome back</h1><br><p>Your OTP for login is ${otp}, will expire in 5 minutes</p></br>`
      };

      sendEmail(emailData);
      await setKey(scode, JSON.stringify({ 'otp': otp, 'userData': user, 'resendCount': 0, 'lastResendTime': 0 }));
      res.send({
        message: 'OTP sent successfully',
        status: 1,
        email: email,
        code: scode,
      });

    }
    else {
      return res.status(400).send({ message: 'User does not exist' });
    }
  } catch (error) {
    console.error('OTP sending failed:', error);
    res.send({
      status: 0,
      message: 'Failed to send OTP.',

    });
    throw error;
  }
}

export async function verifyOTP(req: Request, res: Response) {
  const { scode, otp } = req.body;
  try {

    let data = await getKey(scode);
    let redisValue = JSON.parse(data as string);
    if (!redisValue) {
      return res.status(200).json({ message: 'OTP not found' });
    }

    const storedOTP = redisValue.otp;
    const user_id = redisValue.userData.user_id;
    const userEmail = redisValue.userData.email;
    if (storedOTP == otp) {
      const token = jwt.sign({ userEmail }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '10d'
      });


      await db.getModels().users.update({ token: token },
        {
          where: {
            user_id: user_id
          }
        })

      const updatedUser = await db.getModels().users.findOne({
        where: {
          user_id: user_id
        }
      });

      let obj = JSON.stringify({ token: token, userData: updatedUser });
      console.log(obj)
      await setKey(token, obj);


      res.status(200).json({
        status: 1,
        message: 'OTP verified successfully',
        token: token,
      });
    }

    else {
      res.send(
        {
          status: 0,
          message: "Invalid otp"
        })
    }
  }
  catch (error) {
    console.error('Failed to verify OTP:', error);
    res.send({
      status: 5,
      message: 'Failed to verify OTP'
    });
  }
}

export async function resendOtp(req: Request, res: Response) {

  const { scode } = req.body;

  if (scode) {
    let data = await getKey(scode);
    let parsedData = JSON.parse(data as string);

    const email = parsedData.userData.email;
    let resendCount = parsedData.resendCount;

    // Check if the user has reached the maximum number of resends (5)
    if (resendCount >= 5) {
      const lastResendTime = parsedData.lastResendTime;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastResendTime;

      // Check if the minimum time (5 minutes) has passed since the last resend
      if (timeDiff < 5 * 60 * 1000) {
        const remainingTime = Math.ceil((5 * 60 * 1000 - timeDiff) / 1000 / 60);
        return res.status(400).json({ error: `Please wait ${remainingTime} minutes before resending OTP` });
      }
      resendCount = 0;
      parsedData.lastResendTime = 0;
    }


    const otp = Math.floor(100000 + Math.random() * 900000);

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP for Login',
      html: `<h1>Welcome back</h1><br><p>Your OTP for login is ${otp}, will expire in 5 minutes</p></br>`
    };

    sendEmail(emailData);
    parsedData.otp = otp;
    parsedData.resendCount = resendCount + 1;
    parsedData.lastResendTime = Date.now();

    await setKey(scode, JSON.stringify(parsedData));
    res.status(200).json({
      message: 'OTP sent successfully',
      status: 1,
    });
  }
  else {
    res.send({
      status: 0,
      message: "Failed to resend otp"
    })
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {

  let token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.send({ message: "You are not logged in..." })

  }

  try {
    let data = await getKey(token);
    let redisValue = JSON.parse(data as string);
    const user = redisValue.userData.email;
    if (!user) {
      res.send({ message: "User belong to this token doesnot exist" });

    }
    else {
      next();
    }
  } catch (error) {

    res.send({
      message: "Not logged in"
    })
  }

}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {

  let token = req.headers.authorization?.split(' ')[1];
  let data = await getKey(token);
  let redisValue = JSON.parse(data as string);
  if (redisValue.userData.userType == "admin") {
    next();
  }
  else {

    res.send({
      status: 0,
      message: "Unautorized access"
    })
  }
}

export async function logout(req: Request, res: Response) {

  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
    let data = await getKey(token);
    let redisValue = JSON.parse(data as string);
    const user_id = redisValue.userData.user_id;
    await deleteKey(token);


    db.getModels().users.update({
      token: null
    },
      {
        where: {
          user_id: user_id
        }
      })
    res.status(200).json({
      message: 'success',

    })
  }
}



