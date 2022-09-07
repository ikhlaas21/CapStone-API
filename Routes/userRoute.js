const express = require("express");
const con = require("../dbconn/dbconn");
const router = express.Router();
const port = process.env.PORT;
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcrypt");

/// fetching all from users
router.get("/", (req, res) => {
    try {
        con.query("SELECT* FROM users", (err, result) => {
            if (err) throw err

            res.send(result)
        })
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
})

// fetch one from users 
router.get("/:id", (req, res) => {
    try {
        const strQry = `SELECT * FROM users WHERE id = ${req.params.id}`
        
        con.query(strQry, (err, results) => {
            if (err) throw err;
            res.json({
                results,
                msg : "One from users was selected"
            }) 
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})

/// delete users 
router.delete("/:id", (req, res) => {
    try {
        const strQry = `DELETE FROM users WHERE id = ${req.params.id}`
        
        con.query(strQry, (err, results) => {
            if (err) throw err;
            res.json({
                msg : "Deleted the user was"
            }) 
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add register
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
  
  // user login
  router.patch("/", bodyparser.json(), (req, res) => {
    try {
      const { email, userpassword } = req.body;
      const strQry = `SELECT * FROM users WHERE email = '${email}'`;
  
      con.query(strQry, async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          res.json({
            msg: "not found email was",
          });
        } else {
          const isMatch = await compare(userpassword, results[0].userpassword);
          if (isMatch === true) {
            const payload = {
             user : results[0]
              // user: {
              //   id: results[0].id,
              //   username: results[0].username,
              //   email: results[0].email,
              //   usertype: results[0].usertype,
              }
              jwt.sign(
                  payload,
                  process.env.jwtSecret,
                  {
                      expiresIn: "365d",
              },
              (err, token) => {
                  if (err) throw err;
                  res.json({
                      msg: "Login Successful",
                      user: results,
                      token: token,
                  });
                  // res.json(payload.user);
              }
              );
          // };
            
          } else {
            res.json({
              msg: "Incorrect your password was",
            });
          }
        }
      });
    } catch (error) {
      res.status;
    }
  });
  
  // end_user update listing
  router.put("/:id", (req, res)=>{
      try {
          const strQry = `UPDATE listings SET ? WHERE id = ${req.params.id}`;
          const  { listingName, listingUrl,listingDescription, githubUrl,linkedinUrl, projectLink, personDescription,SpecialtyOption , profile} = req.body
  
          const user = {
            listingName,listingUrl,listingDescription, githubUrl,linkedinUrl, projectLink, personDescription,SpecialtyOption , profile
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
/////////////////////////////////////////////////////////////////////////////////////////////////////



///
module.exports=router