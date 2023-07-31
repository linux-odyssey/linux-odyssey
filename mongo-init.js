const user = process.env.MONGO_USER
const password = process.env.MONGO_PASS
const dbName = process.env.MONGO_DB

db = db.getSiblingDB(dbName)
db.createUser({
  user: user,
  pwd: password,
  roles: [{ role: 'readWrite', db: dbName }],
})
