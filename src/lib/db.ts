import mongoose,{Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || '';

if(!MONGODB_URL){
    throw new Error('Please define the MONGODB_URL enviorment')
}

declare global{
    var mongooseCache:{
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    } | undefined;
}

const globalWithMongoose = globalThis as typeof globalThis & {
    mongooseCache?: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    }
}

if(!globalWithMongoose.mongooseCache){
    globalWithMongoose.mongooseCache = {conn: null, promise: null};
}

const cached = globalWithMongoose.mongooseCache;

async function dbConnect(): Promise<Mongoose> {
    if(cached.conn) return cached.conn;

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URL, {
            bufferCommands: false,
        })
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;