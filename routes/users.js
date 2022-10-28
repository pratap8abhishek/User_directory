const User = require("../models/user");
const router = require("express").Router();


router.post("/register",async(req,res)=>{
    try {
        const { first_name, last_name, email, password } = req.body;
        
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("all input is required");
          }

          const oldUser = await User.findOne({email});

          if(oldUser){
            return res.status(409).send("User Already Exist. Please Login");
          }

          encryptedPassword = await bcrypt.hash(password, 10);

          const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
          });

          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );

          user.token = token;
          res.status(201).json(user);
    } catch (err) {
        res.sendStatus(500).json(err);
    }
});

router.post("/login",async(req,res)=>{
  try {
     const {email,password} = req.body;

     if(!(email && password)){
      res.status(400).send("All input is required");
     }

     const user = await User.findOne({email});

     if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {user_id: user._id,email},
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;

      res.status(200).json(user);
     }
     res.status(400).send("Invalid");
  } catch (err) {
    res.status(500).json(err);
    
  }
});

router.get("/:id",async(req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id",async(req,res)=>{
 try {
  await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {new: true}
  )
 } catch (err) {
  res.status(500).json(err);
 }
});

router.delete("/:id",async(req,res)=>{
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Data is Deleated Succesfully");
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;

