import User from "../models/users.model.js";
import Verify from "../models/verify.tokens.model.js";
import { createError, gen_verification_token, sendEmail } from "../utils/helper.js";
import { createToken } from "../utils/jwt.js";


/* --------------- register user -------------- */
export const register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    // create user and hash the password
    const newuser = await User.create({ fullname, email, password });
    const verify_token = await gen_verification_token(newuser);
    await sendEmail(newuser, verify_token.token);

    res.json({ status: "register-success" });
  } catch (error) {
    next(error);
  }
};


/* --------- verify registered account -------- */
export const verifyAccount = async(req, res, next) => {
  try {
    const token = req.params.vtoken;
    const userid = req.params.uid;
    console.log(token, userid)
    const verified = await Verify.findOne({token, userid});
    if(!verified) throw createError('Verify link is not valid.', 401);

    // find a user and activate him/her
    const findUser = await User.findById(userid);
    if(!findUser){
      throw createError('User already deleted!', 401);
    }
    findUser.is_activated = true;
    await findUser.save();

    res.json({status: 'verify-account-success'});
  } catch (error) {
    next(error)
  }
}


/* ------------ login to my account ----------- */
export const login = async(req, res, next) => {
  try {
    const {email, password} = req.body;

    // find user by email
    const user = await User.findOne({email});
    if(!user) throw createError('Email or Password is not correct', 401);

    // compare password
    if(!await user.comparePass(password))
      throw createError('Email or Password is not correct', 401);


    // remove un-necessary data from user object
    user.__v = undefined;
    user.password = undefined;
    user.role = undefined;
    user.register_at = undefined;
    user.pass_changed_at = undefined;
    user.is_activated = undefined;


    // create jwt token
    const token = await createToken(
      {userid: user._id, fullname: user.fullname},
      process.env.JWT_SECRET
    );

    // set cookie
    res.cookie('token', token, {expiresIn: new Date(Date.now()+ 3_600_000 * 24), httpOnly: true})
      .json({status: 'login-success', user});
    
  } catch (error) {
    next(error)
  }
}