import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/phishguard";
const options = {
  serverSelectionTimeoutMS: 2000, // Fail quickly if MongoDB service is not running
};

let clientPromise: Promise<any>;
let useFileFallback = false;
const fallbackFilePath = path.join(process.cwd(), "db_fallback.json");

// Helper to read fallback JSON database
function readFallbackDb() {
  if (!fs.existsSync(fallbackFilePath)) {
    fs.writeFileSync(
      fallbackFilePath,
      JSON.stringify({ brands: [], tlds: [], keywords: [], scans: [], feedback: [] }, null, 2)
    );
  }
  try {
    return JSON.parse(fs.readFileSync(fallbackFilePath, "utf-8"));
  } catch (e) {
    return { brands: [], tlds: [], keywords: [], scans: [], feedback: [] };
  }
}

// Helper to write fallback JSON database
function writeFallbackDb(data: any) {
  fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2));
}

// Mock Collection implementation matching MongoDB driver API
class MockCollection {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  find(query: any = {}) {
    const data = readFallbackDb();
    const list = data[this.name] || [];
    // Basic filter matching
    const filtered = list.filter((item: any) => {
      for (const key in query) {
        const qVal = query[key] && typeof query[key] === "object" ? query[key].toString() : query[key];
        const iVal = item[key] && typeof item[key] === "object" ? item[key].toString() : item[key];
        if (iVal !== qVal) return false;
      }
      return true;
    });

    return {
      sort(sortQuery: any) {
        if (sortQuery.timestamp === -1) {
          filtered.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        return this;
      },
      limit(n: number) {
        return {
          async toArray() {
            return filtered.slice(0, n);
          },
        };
      },
      async toArray() {
        return filtered;
      },
    };
  }

  async findOne(query: any) {
    const data = readFallbackDb();
    const list = data[this.name] || [];
    const item = list.find((item: any) => {
      for (const key in query) {
        const qVal = query[key] && typeof query[key] === "object" ? query[key].toString() : query[key];
        const iVal = item[key] && typeof item[key] === "object" ? item[key].toString() : item[key];
        if (iVal !== qVal) return false;
      }
      return true;
    });
    return item || null;
  }

  async insertOne(doc: any) {
    const data = readFallbackDb();
    if (!data[this.name]) data[this.name] = [];
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11),
      ...doc,
    };
    data[this.name].push(newDoc);
    writeFallbackDb(data);
    return { insertedId: newDoc._id };
  }

  async insertMany(docs: any[]) {
    const data = readFallbackDb();
    if (!data[this.name]) data[this.name] = [];
    const insertedDocs = docs.map((doc) => ({
      _id: Math.random().toString(36).substring(2, 11),
      ...doc,
    }));
    data[this.name].push(...insertedDocs);
    writeFallbackDb(data);
    return { insertedIds: insertedDocs.map((d) => d._id) };
  }

  async updateOne(query: any, update: any) {
    const data = readFallbackDb();
    const list = data[this.name] || [];
    const item = list.find((item: any) => {
      for (const key in query) {
        const qVal = query[key] && typeof query[key] === "object" ? query[key].toString() : query[key];
        const iVal = item[key] && typeof item[key] === "object" ? item[key].toString() : item[key];
        if (iVal !== qVal) return false;
      }
      return true;
    });

    if (item && update.$set) {
      Object.assign(item, update.$set);
      writeFallbackDb(data);
    }
    return { modifiedCount: item ? 1 : 0 };
  }

  async countDocuments() {
    const data = readFallbackDb();
    return (data[this.name] || []).length;
  }
}

// Mock Database wrapper matching MongoDB Db API
const mockDbInstance = {
  collection(name: string) {
    return new MockCollection(name);
  },
};

const client = new MongoClient(uri, options);
clientPromise = client
  .connect()
  .then((conn) => {
    console.log("Connected to MongoDB successfully.");
    return conn;
  })
  .catch((err) => {
    console.warn("MongoDB connection failed. Switching to local JSON file database fallback.");
    useFileFallback = true;
    return client;
  });

export default clientPromise;

export async function getDb(): Promise<any> {
  await clientPromise;
  if (useFileFallback) {
    return mockDbInstance;
  }
  const connection = await clientPromise;
  return connection.db();
}
