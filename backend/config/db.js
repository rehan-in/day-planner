// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
    const primaryUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/dayplanner";

    // Attempt primary MongoDB Atlas connection first
    if (primaryUri) {
        try {
            console.log("⏳ Attempting primary MongoDB Atlas connection...");
            const conn = await mongoose.connect(primaryUri, {
                serverSelectionTimeoutMS: 4000
            });
            console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
            return;
        } catch (atlasError) {
            console.warn("⚠️ MongoDB Atlas connection unavailable (IP whitelist or network issue):", atlasError.message);
            console.log("🔄 Falling back to local MongoDB instance...");
        }
    }

    // Fallback to local MongoDB
    try {
        const localConn = await mongoose.connect(localUri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`✅ Local MongoDB connected: ${localConn.connection.host}:${localConn.connection.port}/${localConn.connection.name}`);
    } catch (localError) {
        console.error("❌ Local MongoDB connection failed:", localError.message);
        console.error("💡 Please make sure MongoDB is running locally on port 27017 or whitelist your IP on MongoDB Atlas.");
        process.exit(1);
    }
};

module.exports = connectDB;