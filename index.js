const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { PrismaClient } = require("@prisma/client")
dotenv.config()

const prisma = new PrismaClient()
const app = express()

app.use(cors())
app.use(express.json())

// Routes

app.get("/", (req, res) => {
  res.send("✅ Backend running")
})

app.post("/register", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.create({
      data: { email, password },
    })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: "Email already in use" })
  }
})

app.post("/trades", async (req, res) => {
  const { userId, symbol, entry, exit } = req.body
  const profit = exit - entry
  const trade = await prisma.trade.create({
    data: { userId, symbol, entry, exit, profit },
  })
  res.json(trade)
})

app.get("/trades/:userId", async (req, res) => {
  const trades = await prisma.trade.findMany({
    where: { userId: req.params.userId },
  })
  res.json(trades)
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`)
})
