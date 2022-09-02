const express = require("express");
const con = require("../dbconn/dbconn");
const router = express.Router();
// const port = process.env.PORT;
const bodyparser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const { hash, compare } = require("bcrypt");
 
 
 // add register listing
router.post("/", bodyparser.json(), async (req, res) => {
    try {
      const user = req.body;
      if (user.usertype === "" || user.usertype === null) {
        user.usertype = "user";
      }
      let emailCheck = `SELECT * FROM users WHERE email = '${user.email}';`;
      con.query(emailCheck, async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.json({
            msg: "Email already in use",
          });
        } else {
          // adding to db
          const strQry = `INSERT INTO users (fullname, email, usertype, userpassword) VALUES(?, ?, ?, ?);`;
          user.userpassword = await hash(user.userpassword, 10);
          con.query(
            strQry,
            [user.fullname, user.email, user.usertype, user.userpassword],
            async (err, results) => {
              if (err) throw err;
              res.json({
                results: results,
                msg: "Successful Registration was",
              });
            }
          );
        }
      });
    } catch (error) {
      res.status(400).json({
        error: error,
      });
    }
  });
 
 
 // end_user update listing
 router.put("/:id", (req, res)=>{
    try {
        const strQry = `UPDATE listings SET ? WHERE id = ${req.params.id}`;
        const  { listingName, listingUrl,listingDescription, githubUrl,linkedinUrl, projectLink, personDescription,SpecialtyOption} = req.body

        const user = {
          listingName,listingUrl,listingDescription, githubUrl,linkedinUrl, projectLink, personDescription,SpecialtyOption 
        }
        con.query(strQry, user, (err, results) => {
            if (err) throw err;

            res.json({
                msg : "Updated Successfully"
            })
        })
    } catch (error) {
        res.send(400).json({
            error
        })
    }
})

//////
// fetch one from listings 
router.get("/:id", (req, res) => {
    try {
        const strQry = `SELECT * FROM listings WHERE id = ${req.params.id}`
        
        con.query(strQry, (err, results) => {
            if (err) throw err;
            res.json({
                results : results,
                msg : "One from listings was selected"
            }) 
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

// fetch one from listings posting
router.get("/userlisting/:id", (req, res) => {
  try {
      const strQry = `SELECT * FROM listings WHERE userid = ${req.params.id}`
      
      con.query(strQry, (err, results) => {
          if (err) throw err;
          res.json({
              results : results,
              msg : "profile already exists"
          }) 
      })
  } catch (error) {
      res.status(400).json({
          error
      })
  }
})

/// fetch all
router.get("/listings", (req, res) => {
  try {
      con.query("SELECT* FROM listings", (err, result) => {
          if (err) throw err

          res.json({
            status : 200,
            results : result
          })
      })
  } catch (error) {
      console.log(error);
      res.status(400).send(error)
  }
})


/// delete listings
router.delete("/:id", (req, res) => {
    try {
        const strQry = `DELETE FROM listings WHERE id = ${req.params.id}`
        
        con.query(strQry, (err, results) => {
            if (err) throw err;
            res.json({
                msg : "Deleted the listing was"
            }) 
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

module.exports = router