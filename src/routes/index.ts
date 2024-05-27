import express, { Request, Response } from "express";

import main from "..";
import bodyParser from "body-parser";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000; // Port number for the server to listen on


//get all~
app.post('/getemails', async (req: Request, res: Response) => {
    // post username ,password , postnumber , keyword to search
    const {username, password, postnumber, keyword} = req.body;
    if(!username || !password || !postnumber || !keyword){
        console.log({username, password, postnumber, keyword})
        return res.status(400).send("Please provide all required fields");
    }
    return main(username, password, postnumber, keyword).then((data) => {
        res.send(data);
    })

});

app.listen(port,()=>{
    console.log("listening on port 3000")
})