import express, { Request, Response } from "express";
import admin from "firebase-admin";

const router = express.Router();

const serviceAccount = require("../src/service-account.json");
admin.initializeApp({
    credential: admin.credential.cert(process.env.service as string),
    databaseURL:"https://smart-home-a2edf-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

router.get("/", (req: Request, res: Response) => {

    res.json({
        message: "Api is running",
    });
});
router.post("/deleteUser", (req: Request, res: Response) => {

    const { uid } = req.body;
    admin.auth().deleteUser(uid).then(() => {
        console.log("User Deleted");
        res.json({
            message: "User Deleted",
        });
    }).then(() => {
        admin.firestore().collection("user").doc(uid).delete();
        admin.database().ref("Switches").child(uid).remove();
    }).catch((error) => {
        console.log(error);
        res.json({
            message: error,
        });
    });
    
});
export { router };