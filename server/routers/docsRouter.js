import express from 'express'
import jwt from '../library/jwt'
const router = express.Router()
import table from '../library/db'
import { check, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
import path from 'path'
import axios from 'axios'
import fs from 'fs'
import docx from '../library/docx'
const db = table("docs")
/*
  ---
*/
// var dir = '../client/public/img'
var dir = 'doc'
router.post("/", [
  check("name").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let docFile = req.files.doc
    let docname = `${new Date().getTime()}_${docFile.name}`
    if (path.extname(docFile.name) === ".docx") {
      docFile.mv(`${dir}/${docname}`)
      let q = db.insert().set({id_user: p.id, name: req.body.name, docs: docname}).build()
      let result = await db.query(q)
      res.json(result)
    }
    else res.json({status: false, err: "notDocx"})
  }
  else {
    res.json({status: false})
  }
}))

router.delete("/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let qr = db.select().select("docs").where({id: req.params.id}).build()
    let file = await db.query(qr)
    fs.unlink(path.join('doc', file.res[0].docs), ()=>{})
    let q = db.delete().where({id: req.params.id}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

router.put("/:id", [
  check("name").exists(),
  check("doc").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let docFile = req.files.doc
    let docname = `${new Date().getTime()}_${docFile.name}`
    if (path.extname(docFile.name) === ".docx") {
      let qr = db.select().select("docs").where({id: req.params.id}).build()
      let file = await db.query(qr)
      fs.unlink(path.join('doc', file.res[0].docs), ()=>{})

      docFile.mv(`${dir}/${docname}`)
      let q = db.update().set({name: req.body.name, docs: docname}).where({id: req.params.id}).build()
      let result = await db.query(q)
      res.json(result)
    }
    else res.json({status: false, err: "notDocx"})
  }
  else {
    res.json({status: false})
  }
}))

router.get("/", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let q = db.select().build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

router.get("/variable/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let q = db.select().select('docs').where({id: req.params.id}).build()
    let result = await db.query(q)
    let doc = result.res[0].docs
    res.json({v: docx.getVariable(path.join(__dirname, '..', 'doc', doc))})
  }
  else {
    res.json({status: false})
  }
}))

router.get("/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let q = db.select()
    if (req.query.docsData) {
      q = q.select('name', 'docs')
    }
    q = q.where({id: req.params.id}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

router.get("/rules/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let q = db.select().select('rules').where({id: req.params.id}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

router.put("/rules/:id", [
  check("rules").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let q = db.update().set({rules: JSON.stringify(req.body.rules)}).where({id: req.params.id}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

module.exports = router
