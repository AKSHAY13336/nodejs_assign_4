
const API='/api/employees';
const loader=document.getElementById('loader');
const show=()=>loader.style.display='block';
const hide=()=>loader.style.display='none';

async function loadEmployees(){
 show();
 const {data}=await axios.get(API);
 let html='';
 data.forEach(e=>{
 html+=`<tr>
 <td>${e.name}</td><td>${e.age}</td><td>${e.mobile}</td>
 <td>${e.city}</td><td>${e.department}</td><td>${e.salary}</td>
 <td>
 <button onclick="editEmp(${e.id})">Edit</button>
 <button onclick="deleteEmp(${e.id})">Delete</button>
 </td></tr>`;
 });
 document.getElementById('tbody').innerHTML=html;
 hide();
}

document.getElementById('empForm').onsubmit=async(e)=>{
 e.preventDefault(); show();
 const emp={
 name:name.value,age:age.value,mobile:mobile.value,city:city.value,
 department:department.value,salary:salary.value
 };
 if(id.value) await axios.put(API+'/'+id.value,emp);
 else await axios.post(API,emp);
 e.target.reset(); id.value='';
 await loadEmployees(); hide();
};

async function editEmp(empId){
 const {data}=await axios.get(API+'/'+empId);
 id.value=data.id; name.value=data.name; age.value=data.age;
 mobile.value=data.mobile; city.value=data.city;
 department.value=data.department; salary.value=data.salary;
}

async function deleteEmp(empId){
 await axios.delete(API+'/'+empId);
 loadEmployees();
}
loadEmployees();
