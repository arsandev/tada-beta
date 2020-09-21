import express from 'express'
import jwt from '../library/jwt'
const router = express.Router()
import table from '../library/db'
import { check, validationResult } from 'express-validator'
import asyncHandler from 'express-async-handler'
const db = table("doc_party")
/*
  ---
*/
router.get("/:id", asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === 'admin') {
    var query = db.select().select('name', 'data','id').where({id: req.params.id}).build()
    let data = await db.query(query)
    res.json(data)
  }
}))

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
router.get("/id_doc/:id_doc", asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === 'admin') {
    var query = db.select()
    if (req.query.onlyName) {
      query = query.select('id', 'name')
    }
    else {
      query = query.select('name', 'data','id')
    }
    query = query.where({id_doc: req.params.id_doc}).build()
    let data = await db.query(query)
    if (req.query.onlyName) {
      data = data.res
      let results = []
      for (var key in data) {
        let query = await db.query(db.select("doc_copy").select('id', 'id_user', 'status', 'id_copy_file').from("users", "id", "id_user").select("username").where({id_doc_party: data[key].id}).build())
        var result = query.res.map(function(el) {
          var o = Object.assign({}, el)
          o.name = data[key].name
          return o
        })
        results.push(groupBy(result, 'name'))
      }
      res.send({status: true, data: results})
    }
    else res.json(data)
  }
}))

router.post("/", [
  check("name").exists(),
  check("id_doc").exists(),
  check("data").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let check = await db.query(db.select("docs").where({id: req.body.id_doc}).build())
    if (p.id === check.res[0].id_user) {
      let data = JSON.stringify(req.body.data)
      let q = await db.query(db.insert().set({id_doc: req.body.id_doc, name: req.body.name, data: data}).build())
      res.json(q)
    }
    else {
      res.json({status: false})
    }
  }
}))

router.put("/:id", [
  check("name").exists(),
  check("data").exists()
], asyncHandler(async (req, res) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: false, err: errors.array() });
  }
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    let data = JSON.stringify(req.body.data)
    let q = await db.query(db.update().set({name: req.body.name, data: data}).where({id: req.params.id}).build())
    res.json(q)
  }
}))

router.delete("/:id", asyncHandler(async (req, res) => {
  let p = jwt.verify(jwt.getToken(req.headers.authorization)).results
  if (p.status === "admin") {
    var q = db.delete().where({id: req.params.id}).build()
    let result = await db.query(q)
    res.json(result)
  }
  else {
    res.json({status: false})
  }
}))

module.exports = router
