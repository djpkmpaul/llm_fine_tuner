import mongoose from "mongoose";

export async function connect() {
    try {
        //* "!" SAYS "dont worry i will assure the url is always present and wont throw an error"
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', ()=>{
            console.log("mongoDB connected successfully...");
        })

        connection.on('error', (error: any)=>{
            console.log("Error connecting to mongoDB");
            console.log(error);
            process.exit();
        })
    } catch (error) {
        console.log("Somthing went wrong");
        console.log(error);      
    }
}

