import express from 'express'
import jwt from '../library/jwt'
const router = express.Router()
import table from '../library/db'
const db = table("example")
import docx from '../library/docx'
import path from 'path'
/*
  ---
*/
router.get('/', (req,res)=>{ //get all
  // docx.text("12.docx", {
  //   name: "Tegar Santosa",
  //   position: "Bos Besar",
  //   image: "{%image}"
  // })
  // docx.signature("12.docx", {
  //   image: path.join(__dirname, "..", "library", "ASD.PNG")
  // })
        res.send(path.join(__dirname, "..", "library", "ASD.PNG"))
})

module.exports = router
