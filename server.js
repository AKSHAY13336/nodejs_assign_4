
const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let employees=[];

app.get('/api/employees',(req,res)=>res.status(200).json(employees));
app.get('/api/employees/:id',(req,res)=>res.status(200).json(employees.find(x=>x.id==req.params.id)||{}));
app.post('/api/employees',(req,res)=>{
 const emp={id:Date.now(),...req.body};
 employees.push(emp);
 res.status(200).json(emp);
});
app.put('/api/employees/:id',(req,res)=>{
 const i=employees.findIndex(x=>x.id==req.params.id);
 if(i>-1) employees[i]={...employees[i],...req.body};
 res.status(200).json(employees[i]||{});
});
app.delete('/api/employees/:id',(req,res)=>{
 employees=employees.filter(x=>x.id!=req.params.id);
 res.status(200).json({message:'deleted'});
});
app.get('/api/employees/compensation/:id',(req,res)=>{
 const e=employees.find(x=>x.id==req.params.id);
 res.status(200).json(e?{department:e.department,salary:e.salary}:{});
});
app.listen(process.env.PORT||8000);
