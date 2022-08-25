const express = require("express");
const con = require("../dbconn/dbconn");
const router = express.Router();
// const port = process.env.PORT;
const bodyparser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const { hash, compare } = require("bcrypt");
const middleware = require("../middleware/auth")

// fetch one for enquiries 
router.get("/:id", (req, res) => {
    try {
        const strQry = `SELECT* FROM enquiries WHERE enquiryid = ${req.params.id}`

        con.query(strQry, (err, results) => {
            if (err) throw err;
            res.json({
                results,
                msg: "Selected from enquiries one was"
            })
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

///remove an enquiry
router.delete("/:id", (req, res) => {
            try {
                const strQry = `DELETE FROM enquiries WHERE enquiryid = ${req.params.id}`

                con.query(strQry, (err, results) => {
                    if (err) throw err;
                    res.json({
                        msg: "Deleted the enquiry was"
                    })
                })
            } catch (error) {
                res.status(400).json({
                    error
                })
            }
        })

        //// remove all    
        router.delete("/:id", (req, res) => {
            try {
                con.query(`DELETE * FROM enquiries WHERE id = ${req.params.id}`, (err, result) => {
                    if (err) throw err

                    res.send(result)
                })
            } catch (error) {
                console.log(error);
                res.status(400).send(error)
            }
        })




        ////add enquiry

        router.post("/:id", bodyparser.json(), middleware, (req, res) => {
            try {
                const strQry = `INSERT INTO enquiries (enquiryList, userid,listingsid) values (?,?,?)`
                const bd = req.body
                con.query(strQry, [bd.listingName, req.user.id, req.params.id], (err, results) => {
                    if (err) throw err;
                    res.json({
                        msg: "Your Enquiry was also added to the Enquiries"
                    })
                })
            } catch (error) {
                res.status(400).json({
                    error
                })
            }
        })




        module.exports = router