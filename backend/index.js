import dns from 'node:dns/promises';

// Forces Node to use public DNS servers that support SRV records
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { SigninSchema, SignupSchema } from './db/zod/zodValidation';
import bcrypt from "bcrypt";
import { UserModel } from "./db/schema/userSchema.js";
import jwt from 'jsonwebtoken';
import { ProblemModel } from './db/schema/problemSchema.js';

const app = express();

app.use(cors());
app.use(express.json());

async function startServer() {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        }  )
    }catch(err){
        console.log(err);
    }
} 
startServer();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
    const {success, data} = SignupSchema.safeParse(req.body);

    if(!success){
        res.status(403).json({message: "invalid username or password"});
    }
    try{
        const hashedPassword = await bcrypt.hash(data.password, parseInt(process.env.SALT_ROUNDS));
        const user = await UserModel.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });
        res.status(200).json({id: user._id})
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Error"
        })
    }
});

app.post("/signin", async (req, res) => {

    const result  = SigninSchema.safeParse(req.body);
    if(!result.success){
        return  res.status(403).json({
            message: "Invalid Info",
        })
    }

    const data = result.data;

    try{
        const user =  await UserModel.findOne({
            email: data.email,  
        });


        if(!user){
            return res.status(401).json({
                message: "user not found",
            })
        }

        const isMatch =  await bcrypt.compare(data.password, user.password);

        if(!isMatch){
            res.status(401).json({
                message: "incorrect username or password"
            })
            return;
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "24h"}

        
        )

        res.status(200).json({
            id: user._id,
            token: token,
        })

        
    }catch(e){
        console.log(e);
        res.status(500).json({
            message: "internal server error",
        })
    }

});

app.get("/problems", async (req, res) => {
    try{
        const problems = await ProblemModel.find();
        // console.log(problems);
        const problem = problems.map((p) => {
            return {
                title: p.title,
                difficulty: p.difficulty,   
            }
                
        })
        res.status(200).json({data: problem});
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Error"
        })
    }
})


app.get("/problem/:name", async (req, res) => {
    try{
        const title = req.params.name;
        console.log(title);
        const problem = await ProblemModel.findOne({title: title});
        const data =
             {
                title: problem.title,
                difficulty: problem.difficulty,
                description: problem.description,
                starterCode: problem.starterCode,
                supportedLanguages: problem.supportedLanguages,
                topics: problem.topics
            }
        
        console.log(data);
        res.status(200).json({data: data});
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Internal Error"
        })
    }
} )