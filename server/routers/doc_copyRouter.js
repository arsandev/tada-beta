import express from 'express'
import jwt from '../library/jwt'
const router = express.Router()
import table from '../library/db'
import { check, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
const db = table("doc_copy")
/*
  ---
*/
router.get("/", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  var query = db.select().build()
  let data = await db.query(query)
  res.send(data)
}))

router.post("/", [
  check("data").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let data = req.body.data
    if (typeof data === "object") {
      let q_copy_file = await db.query(db.insert("doc_copy_file").set().build())
      if (q_copy_file.status) {
        let count = 0
        for (var v of data) {
          if (v.selected) {
            let q = await db.query(db.insert().set({id_copy_file: q_copy_file.res.insertId, id_doc_party: v.id, id_user: v.selected}).build())
            count = count+1
          }
          else res.json({status: false})
        }
        if (count == data.length) res.json({status: true})
      }
      else res.json({status: false})
    }
    else res.json({status: false})
  }
}))

router.delete("/copy_file/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === 'admin') {
    let q = await db.query(db.delete("doc_copy_file").where({id: req.params.id}).build())
    res.json(q)
  }
}))

// PARTY ACCESS
router.get("/party/get_docs", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === 'party') {
    if (req.query.status) {
      var query = db.select().select("id_doc_party").from("doc_party", "id", "id_doc_party").select("id_doc").from("docs", "id", "id_doc").select("name", "docs").where('doc_copy', {id_user: p.id, status: req.query.status}).build()
      let data = await db.query(query)
      res.send(data)
    }
    else res.json({status: false})
  }
}))

module.exports = router
