const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = path.join(__dirname, "db.json");

// Read Database
function readDB() {
    try {
        const data = fs.readFileSync(DB_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return { employees: [] };
    }
}

// Write Database
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* ==========================
   GET ALL EMPLOYEES
========================== */
app.get("/api/employees", (req, res) => {
    const db = readDB();
    res.status(200).json(db.employees);
});

/* ==========================
   GET EMPLOYEE BY ID
========================== */
app.get("/api/employees/:id", (req, res) => {
    const db = readDB();

    const employee = db.employees.find(
        emp => emp.id === parseInt(req.params.id)
    );

    res.status(200).json(employee || {});
});

/* ==========================
   ADD NEW EMPLOYEE
========================== */
app.post("/api/employees", (req, res) => {
    const db = readDB();

    const newEmployee = {
        id:
            db.employees.length > 0
                ? Math.max(...db.employees.map(emp => emp.id)) + 1
                : 1,

        name: req.body.name,
        age: req.body.age,
        mobile: req.body.mobile,
        city: req.body.city,
        department: req.body.department,
        salary: req.body.salary
    };

    db.employees.push(newEmployee);
    writeDB(db);

    res.status(200).json(newEmployee);
});

/* ==========================
   UPDATE EMPLOYEE
========================== */
app.put("/api/employees/:id", (req, res) => {
    const db = readDB();

    const employeeIndex = db.employees.findIndex(
        emp => emp.id === parseInt(req.params.id)
    );

    if (employeeIndex === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    db.employees[employeeIndex] = {
        ...db.employees[employeeIndex],
        ...req.body
    };

    writeDB(db);

    res.status(200).json(db.employees[employeeIndex]);
});

/* ==========================
   DELETE EMPLOYEE
========================== */
app.delete("/api/employees/:id", (req, res) => {
    const db = readDB();

    const employeeIndex = db.employees.findIndex(
        emp => emp.id === parseInt(req.params.id)
    );

    if (employeeIndex === -1) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    const deletedEmployee = db.employees[employeeIndex];

    db.employees.splice(employeeIndex, 1);

    writeDB(db);

    res.status(200).json({
        message: "Employee deleted successfully",
        employee: deletedEmployee
    });
});

/* ==========================
   GET COMPENSATION
========================== */
app.get("/api/employees/compensation/:id", (req, res) => {
    const db = readDB();

    const employee = db.employees.find(
        emp => emp.id === parseInt(req.params.id)
    );

    if (!employee) {
        return res.status(404).json({
            message: "Employee not found"
        });
    }

    res.status(200).json({
        department: employee.department,
        salary: employee.salary
    });
});

/* ==========================
   START SERVER
========================== */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});