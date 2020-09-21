import express from 'express'
import jwt from '../library/jwt'
const router = express.Router()
import table from '../library/db'
import { check, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import axios from 'axios'
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
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let checkUsername = await db.query(db.select().select("id").where({username: req.body.username}).build())
    if (checkUsername.res.length == 0) {
      var q = db.insert().set({username: req.body.username, password: bcrypt.hashSync(req.body.password), status: "party"}).build()
      let result = await db.query(q)
      res.json(result)
    }
    else res.json({status: false, err:"usernameExists"})
  }
  else {
    res.json({status: false})
  }
}))

router.put("/:id", [
  check("username").exists(),
  check("password").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let setUpdate = {
      username: req.body.username,
    }
    if (req.body.password !== '') setUpdate.password = bcrypt.hashSync(req.body.password)
    var q = db.update().set(setUpdate).where({id: req.params.id}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

router.delete("/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    var q = db.delete().where({id: req.params.id, status: "party"}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

router.get("/me", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  var q = db.select().select("id", "username", "status").where({id: p.id}).build()
  let r = await db.query(q)
  if (r.res.status === "admin") {
    res.json(r.res[0])
  }
  else {
    res.json(r.res[0])
  }
}))

router.get("/", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === 'admin') {
    var q = db.select().select("id", "username").order("id", "Z").where({status: 'party'}).build()
    let r = await db.query(q)
    res.json(r)
  }
  else res.json({status: false})
}))

router.get("/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === 'admin') {
    var q = db.select().select("id", "username").where({id: req.params.id, status: 'party'}).build()
    let r = await db.query(q)
    res.json(r)
  }
  else res.json({status: false})
}))

router.post("/me/username", [
  check("username").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    var q = db.update().set({username: req.body.username}).where({id: p.id}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

router.post("/me/password", [
  check("old").exists(),
  check("new").exists(),
  check("confirm").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  var getPass = await db.query(db.select().select('password').where({id: p.id}).build())
  if (bcrypt.compareSync(req.body.old, getPass.res[0].password)) {
    let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
    if (p.status === "admin") {
      var q = db.update().set({password: bcrypt.hashSync(req.body.new)}).where({id: p.id}).build()
      let result = await db.query(q)
      res.json(result)
    }
  }
  else {
    res.json({status: false})
  }
}))

module.exports = router
