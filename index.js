/* Express App */
const express =require('express')
const cors =require('cors')
const morgan =require('morgan')
const bodyParser =require('body-parser')
const compression =require('compression')
const customLogger =require('../utils/logger')
// const serverless = require('serverless-http');



  const app = express()
  const router = express.Router()
  
    // gzip responses
  router.use(compression())
  
  const mysql = require("mysql");
  const bcrypt = require("bcryptjs");
  
  const users = [];
  // const db = mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   password: "",
  //   database: "skinapp",
  // });
  
  const db = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12549542",
    password: "YzNrawSSi6",
    database: "sql12549542"
  });
  
    // Set router base path for local dev
  // const routerBasePath = process.env.NODE_ENV === 'dev' ? `/index` : `/.netlify/functions/index/`
  router.get('/hello/', function(req, res) {
    res.send('hello world')
  })
  router.post("/doctor_signup", async (req, res) => {
    console.log("input", req.body);
    const email = req.body.userEmail;
    const userSpeciality=req.body.userSpeciality
    const userPMDCID=req.body.userPMDCID
  
    const password = req.body.userPassword;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    const name = req.body.userName;  
  
    db.query(
      "INSERT INTO doctor (Name,Password,Email,speciality,qualification,experience,timing,charges,PMDCID,online)Values(?,?,?,?,?,?,?,?,?,?) ",
      [name, hash, email,userSpeciality,"qualification","experience","timing","charges",userPMDCID,true],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ insertId: result.insertId });
          // res.send("Values Inserted");
          console.log("CValues Inserted");
        }
      }
    );
  });
  
  
  router.post("/patient_signup", async (req, res) => {
    console.log("input", req.body);
    const email = req.body.userEmail;
    const password = req.body.userPassword;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    const name = req.body.userName;  
  
    db.query(
      "INSERT INTO patient (Name,Password,Email,age,gender)Values(?,?,?,?,?) ",
      [name, hash, email,"age","gender"],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send({ insertId: result.insertId });
          // res.send("Values Inserted");
          console.log("CValues Inserted");
        }
      }
    );
  });
  
  router.post("/doctor_login", async (req, res) => {
    const email = req.body.userEmail;
    const password = req.body.userPassword;
    const hash = await bcrypt.hash(password, 10);
    console.log(email, password, hash);
    db.query(
      "SELECT * FROM doctor WHERE email=?",
      [email],
      async (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        if (result.length > 0) {
          // console.log(result[0].Password);
          console.log({ result });
          const validPass = await bcrypt.compare(password, result[0].password);
          console.log(validPass);
          if (validPass) {
            console.log(result);
            // res.send(result).status(200);
            const {id,name,qualification,experience,timing,charges,speciality,pmdcid}=result[0];
            res.status(200).send({id,name,qualification,experience,timing,charges,speciality,pmdcid});
          } else {
            console.log("wrong username pass");
            // res.send({ message: "Wrong Username/Password" }).status(404);
            res.status(404).send({ message: "Wrong Username/Password" });
          }
        } else {
          console.log("wrong username");
          // res.send({ message: "Wrong Username/Password" }).status(404);
          res.status(404).send({ message: "Wrong Username/Password" });
        }
      }
    );
  });
  
  router.get("/patient_login", async (req, res) => {
    console.log(req.body)
    const email = req.body.userEmail;
    const password = String(req.body.userPassword);
    const hash = await bcrypt.hash(password, 10);
    console.log(email, password, hash);
    db.query(
      "SELECT * FROM patient WHERE email=?",
      [email],
      async (err, result) => {
        if (err) {
          res.send({ err: err });
        }
  
        if (result.length > 0) {
          // console.log(result[0].Password);
          console.log({ result });
          const validPass = await bcrypt.compare(password, result[0].password);
          console.log(validPass);
          if (validPass) {
            console.log(result);
            const {name,age,gender,id}=result[0]
            // res.send(result).status(200);
            console.log('login')
            res.status(200).send({name,age,gender,id:id});
          } else {
            console.log("wrong username pass");
            // res.send({ message: "Wrong Username/Password" }).status(404);
            res.status(404).send({ message: "Wrong Username/Password" });
          }
        } else {
          console.log("wrong username");
          // res.send({ message: "Wrong Username/Password" }).status(404);
          res.status(404).send({ message: "Wrong Username/Password" });
        }
      }
    );
  });
  
  router.post("/updateEmployeeRecord", async (req, res) => {
    console.log("input", req.body);
    const email = req.body.email;
  
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    const name = req.body.name;
    const age = req.body.age;
  
    const last_school = req.body.lastSchool;
    const last_qualification = req.body.lastQualification;
    const id = req.body.id;
  
    db.query(
      "UPDATE EMPLOYEE SET Name=?,Password=?,Age=?,Email=?,Last_School=?,Last_Qualification=? WHERE ID=?",
      [name, hash, age, email, last_school, last_qualification, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Updated");
          console.log("Values Updated");
        }
      }
    );
  });
  router.post("/company_registration", async (req, res) => {
    console.log("input", req.body);
    const email = req.body.comp_email;
  
    const password = req.body.comp_password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    const name = req.body.comp_name;
    const sector = req.body.comp_sector;
    const location = req.body.comp_location;
    const Image = req.body.Url;
  
    db.query(
      "INSERT INTO COMPANY (comp_name,comp_password,comp_email,comp_sector,comp_loc,Image)Values(?,?,?,?,?,?) ",
      [name, hash, email, sector, location, Image],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log({ result });
          res.send({ insertId: result.insertId });
          console.log("Values Inserted");
        }
      }
    );
  });
  router.post("/company_login", async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const hash = await bcrypt.hash(password, 10);
  
    console.log(email, password, hash);
    db.query(
      "SELECT * FROM company WHERE comp_email=?",
      [email],
      async (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        if (result.length > 0) {
          console.log("this is result", result[0]);
  
          const validPass = await bcrypt.compare(
            password,
            result[0].comp_password
          );
          console.log(validPass);
          if (validPass) {
            console.log(result);
            // res.send(result).status(200);
            res.status(200).send(result);
          } else {
            console.log("wrong username pass");
            // res.send({ message: "Wrong Username/Password" }).status(404);
            res.status(404).send({ message: "Wrong Username/Password" });
          }
        } else {
          console.log("wrong username");
          // res.send({ message: "Wrong Username/Password" }).status(404);
          res.status(404).send({ message: "Wrong Username/Password" });
        }
      }
    );
    router.post("/updateCompanyRecord", async (req, res) => {
      console.log("input", req.body);
      const email = req.body.comp_email;
      const name = req.body.comp_name;
      const sector = req.body.comp_sector;
      const location = req.body.comp_location;
      const id = req.body.comp_id;
      const password = req.body.comp_password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      // console.log("heloooooooo");
  
      db.query(
        "UPDATE COMPANY SET comp_name=?,comp_password=?,comp_email=?,comp_sector=?,comp_loc=? where comp_id=? ",
        [name, hash, email, sector, location, id],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Values Updated");
            console.log("Values Updated");
          }
        }
      );
    });
  
    // const user = await db("users").first("*").where({ email: email });
    // // const user = users.find((user) => user.email, email);
    // if (user) {
    //   const validPass = await bcrypt.compare(password, user.hash);
    //   if (validPass) {
    //     // console.log(user.json);
    //     console.log(user);
    //   } else {
    //     console.log("wrong username pass");
    //   }
    // } else {
    //   console.log("user not found");
    // }
  });
  router.get("/doctors_for_patient", async (req, res) => {
    console.log("jobs viewing");
    db.query(
      "SELECT id,name,speciality,experience,timing,charges from doctor",
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log(result);
          res.status(200).send(result);
        }
      }
    );
  });
  router.post("/patient_appointments", async (req, res) => {
    console.log("jobs viewing");
    const patient_id=req.body.id;
    console.log(req.body)
    db.query(
      "SELECT * from appointment where patient_id=?",
      [patient_id],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log(result);
          res.status(200).send(result);
        }
      }
    );
  });
  
  router.post("/doctor_appointments", async (req, res) => {
    console.log("jobs viewing");
    const doctor_id=req.body.id;
    console.log(req.body)
    db.query(
      "SELECT * from appointment where doctor_id=?",
      [doctor_id],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log(result);
          res.status(200).send(result);
        }
      }
    );
  });
  
  router.get("/viewEmployeeDetails", async (req, res) => {
    console.log("Employee details viewing");
    db.query(
      "SELECT * FROM EMPLOYEE ",
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          // console.log(result);
          res.status(200).send(result);
        }
      }
    );
  });
  router.post("/deleteCompany", async (req, res) => {
    console.log("deletecompany", req.body);
    const ID = req.body.ID;
    db.query(
      "DELETE FROM COMPANY WHERE comp_id=?",
      [ID],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log(result);
          res.status(200).send(result);
        }
      }
    );
  });
  router.post("/deleteEmployee", async (req, res) => {
    console.log("deleteEMPLOYEE", req.body);
    const ID = req.body.ID;
    db.query(
      "DELETE FROM EMPLOYEE WHERE ID=?",
      [ID],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log(result);
          res.status(200).send(result);
        }
      }
    );
  });
  router.get("/viewCompanyDetails", async (req, res) => {
    console.log("Company Details viewing");
    db.query(
      "SELECT * FROM COMPANY ",
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          // console.log(result);
          res.status(200).send(result);
        }
      }
    );
  });
  
  router.post("/viewMyJobs", async (req, res) => {
    console.log("Display My Jobs");
    console.log("This is data", req.body);
    const comp_id = req.body.comp_id;
    // console.log({ id });
    db.query(
      "SELECT J.*, C.comp_name,C.comp_loc FROM JOBS J, COMPANY C where J.comp_id=? AND J.comp_id=C.comp_id",
      [comp_id],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log({ result });
          res.status(200).send(result);
        }
      }
    );
  });
  router.post("/deletejob", async (req, res) => {
    console.log("deleting My Jobs");
    console.log("This is data", req.body);
    const job_id = req.body.job_id;
    // console.log({ id });
    db.query(
      "DELETE FROM JOBS WHERE JOB_ID=?",
      [job_id],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log({ result });
          res.status(200).send(result);
        }
      }
    );
  });
  router.post("/get_appointment", async (req, res) => {
    console.log("data");
    console.log(req.body);
    const patient_id = req.body.patient_id;
    const doctor_id = req.body.doctor_id;
    const disease = req.body.disease;
    const timing = req.body.timing;
  
    db.query(
      "INSERT INTO appointment (patient_id,doctor_id,disease,timing,taken_place)Values(?,?,?,?,?) ",
      [
       patient_id,doctor_id,disease,timing,"false"
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
          console.log("Values Inserted");
        }
      }
    );
  });
  router.post("/updateJobs", async (req, res) => {
    console.log("data");
    console.log(req.body);
    const job_title = req.body.title;
    const job_desc = req.body.desc;
    const job_skills = req.body.skills;
    const job_years_of_experience = req.body.years_of_experience;
    const job_no_of_positions = req.body.no_of_positions;
    const job_salary = req.body.salary;
    const job_career_level = req.body.career_level;
    // const job_date = req.body.date;
    const job_company = req.body.job_company;
    const job_comp_id = req.body.job_comp_id;
    const job_type = req.body.job_type;
    const job_category = req.body.job_category;
    const job_id = req.body.id;
    db.query(
      "UPDATE JOBS SET job_title=?,job_sal=?,job_desc=?,job_skills=?,job_type=?,job_category=?,comp_id=?,job_career_level=?,job_no_position=?,job_years_of_experience=? WHERE JOB_ID=?",
      [
        job_title,
        job_salary,
        job_desc,
        job_skills,
        job_type,
        job_category,
        job_comp_id,
        job_career_level,
        job_no_of_positions,
        job_years_of_experience,
        job_id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
          console.log("Values Inserted");
        }
      }
    );
  });
  router.post("/Resume", async (req, res) => {
    // console.log("jobs viewing");
    const id = req.body.id;
    console.log(id);
    db.query(
      "SELECT * from JOBS where job_id=?",
      [id],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log(result[0]);
          res.status(200).send(result);
        }
      }
    );
  });
  router.post("/submitResume", async (req, res) => {
    console.log("data");
    console.log(req.body);
    const EMP_ID = req.body.Emp_ID;
    const JOB_ID = req.body.Job_ID;
    const Summary = req.body.Summary;
    const CV = req.body.CV;
    const status = "Pending";
    db.query(
      "INSERT INTO APPLICATION (EMP_ID,JOB_ID,SUMMARY,status,CV)Values(?,?,?,?,?) ",
      [EMP_ID, JOB_ID, Summary, status, CV],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
          console.log("Values Inserted");
        }
      }
    );
  });
  router.post("/DownloadResume", async (req, res) => {
    console.log("This is CV", req.body.CV);
    const CV1 = req.body.CV;
    console.log("This is CV1", CV1);
    // res.send(`uploads\\\\${CV1}`);
    // res.download("Mubeen_Siddiqui_Resume.pdf");
    // app.use(express.static(__dirname + "uploads/Mubeen_Siddiqui_Resume.pdf"));
    // res.attachment(path.resolve("./Mubeen_Siddiqui_Resume.pdf"));
    // res.send();
    res.sendFile(__dirname + "/Mubeen_Siddiqui_Resume.pdf");
  });
  
  router.post("/displayUserJobs", async (req, res) => {
    console.log("Display User Jobs");
    console.log(req.body);
    const id = req.body.id;
    console.log({ id });
    db.query(
      "SELECT A.*,J.job_title from APPLICATION A,JOBS J where emp_id=? AND A.JOB_ID=J.job_id",
      [id],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log({ result });
          res.status(200).send(result);
        }
      }
    );
  });
  
  router.post("/displayCompanyJobs", async (req, res) => {
    console.log("Display Company Jobs");
    console.log(req.body);
    const id = req.body.job_id;
    console.log({ id });
    db.query(
      "SELECT A.*, E.Name from APPLICATION  A ,EMPLOYEE E where JOB_ID=? AND A.EMP_ID=E.ID",
      [id],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          console.log({ result });
          res.status(200).send(result);
        }
      }
    );
  });
  router.post("/Accept", async (req, res) => {
    console.log("input", req.body);
    const Status = "Accepted";
    const ID = req.body.ID;
    console.log(ID);
  
    db.query(
      "UPDATE APPLICATION SET STATUS=? WHERE ID=?",
      [Status, ID],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Updated");
          console.log("Values Updated");
        }
      }
    );
  });
  router.post("/Reject", async (req, res) => {
    console.log("input", req.body);
    const Status = "Rejected";
    const ID = req.body.ID;
    console.log(ID);
  
    db.query(
      "UPDATE APPLICATION SET STATUS=? WHERE ID=?",
      [Status, ID],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Updated");
          console.log("Values Updated");
        }
      }
    );
  });
  router.post("/job_history", async (req, res) => {
    console.log("Display Accepted Jobs");
    console.log(req.body);
    const EMP_ID = req.body.EMP_ID;
    const JOB_ID = req.body.JOB_ID;
    const COMP_ID = req.body.comp_id;
    const STATUS = "Accepted";
    const END_DATE = "Present";
    db.query(
      "INSERT INTO JOB_HISTORY (EMP_ID,JOB_ID,END_DATE,COMP_ID) VALUES (?,?,?,?) ",
      [EMP_ID, JOB_ID, END_DATE, COMP_ID],
  
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          res.send("Values Inserted in Job History");
          console.log("Values Inserted in JOb History");
        }
      }
    );
  });
  router.post("/applyfilter", async (req, res) => {
    console.log("Display Filtered Jobs");
    console.log(req.body);
  
    const city = req.body.search.city;
    const title = req.body.search.title;
    const minSal = req.body.minSal;
    if (city && title && minSal) {
      db.query(
        "SELECT J.*,C.comp_loc,C.comp_name FROM JOBS J, COMPANY C WHERE C.comp_loc=? AND J.job_title=? AND J.job_sal>=? AND J.comp_id=C.comp_id",
        [city, title, minSal * 1000],
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log("filtered", { result });
            res.status(200).send(result);
          }
        }
      );
    } else if (city && title) {
      db.query(
        "SELECT J.*,C.comp_loc,C.comp_name FROM JOBS J, COMPANY C WHERE C.comp_loc=? AND J.job_title=? AND J.comp_id=C.comp_id",
        [city, title],
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log("filtered", { result });
            res.status(200).send(result);
          }
        }
      );
    } else if (city && minSal) {
      db.query(
        "SELECT J.*,C.comp_loc,C.comp_name FROM JOBS J, COMPANY C WHERE C.comp_loc=? AND J.job_sal>=? AND J.comp_id=C.comp_id",
        [city, minSal * 1000],
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log("filtered", { result });
            res.status(200).send(result);
          }
        }
      );
    } else if (title && minSal) {
      db.query(
        "SELECT J.*,C.comp_loc,C.comp_name FROM JOBS J,COMPANY C WHERE job_sal>=? AND job_title=? AND J.COMP_ID=C.COMP_ID",
        [minSal * 1000, title],
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log("filtered", { result });
            res.status(200).send(result);
          }
        }
      );
    } else if (title) {
      db.query(
        "SELECT J.*,C.comp_loc,C.comp_name FROM JOBS J , COMPANY C WHERE job_title=? AND J.comp_id=C.comp_id",
        [title],
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log("filtered", { result });
            res.status(200).send(result);
          }
        }
      );
    } else if (minSal) {
      db.query(
        "SELECT J.*,C.comp_loc,C.comp_name FROM JOBS J, COMPANY C WHERE job_sal>=? AND J.comp_id=C.comp_id",
        [minSal * 1000],
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log("filtered", { result });
            res.status(200).send(result);
          }
        }
      );
    } else if (city) {
      db.query(
        "SELECT J.*,C.comp_loc,C.comp_name FROM JOBS J, COMPANY C WHERE C.comp_loc=? AND J.comp_id=C.comp_id",
        [city],
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log("filtered", { result });
            res.status(200).send(result);
          }
        }
      );
    } else {
      db.query(
        "SELECT J.*, C.comp_name,C.comp_loc FROM JOBS J, COMPANY C where J.comp_id=C.comp_id ",
  
        (err, result) => {
          if (err) {
            res.send({ err: err });
          } else {
            console.log(result);
            res.status(200).send(result);
          }
        }
      );
    }
  });
  
  /*
  app.use('/a',express.static('/b'));
  Above line would serve all files/folders inside of the 'b' directory
  And make them accessible through http://localhost:3000/a.
  */
  // app.use(express.static(__dirname + "/public"));
  // app.use("/uploads", express.static("uploads"));
    // Attach logger
    app.use(morgan(customLogger))
  
    // Setup routes
    // app.use(routerBasePath, router)
  
    // Apply express middlewares
    router.use(cors())
    router.use(bodyParser.json())
    router.use(bodyParser.urlencoded({ extended: true }))
  
// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});
// Export the Express API
module.exports = app;