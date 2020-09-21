import express from 'express'
import jwt from '../library/jwt'
const router = express.Router()
import table from '../library/db'
import { check, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
const db = table("users")
/*
  ---
*/
router.post("/", [
  check("username").exists(),
  check("password").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let q = db.insert().set({username: req.body.username, password: bcrypt.hashSync(req.body.password), status: "party"}).build()
  let result = await db.query(q)
  res.json(result)
}))

router.get("/checkStatusUser", (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  res.json(p)
})

router.post("/login", [
  check("username").exists(),
  check("password").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let q = db.select().select("id","password", "status").where({username: req.body.username}).build()
  let checkUser = await db.query(q)
  let result = checkUser.res
  if (result.length > 0) {
    if (bcrypt.compareSync(req.body.password, result[0].password)) {
      res.json({status:true, type: result[0].status, token: jwt.sign({id: result[0].id, status: result[0].status})})
    }
    else {
      res.json({status: false})
    }
  }
  else {
    res.json({status: false})
  }
}))

module.exports = router
