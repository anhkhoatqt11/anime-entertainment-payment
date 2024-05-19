import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://vercel-admin-user-66496e8989a854548d95277f:q6CmpS9gm72avq97@uitproject.gsgrbdl.mongodb.net/anime_comic?retryWrites=true&w=majority");
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectMongoDB;


