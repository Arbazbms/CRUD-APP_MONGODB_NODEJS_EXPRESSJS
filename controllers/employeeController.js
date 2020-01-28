const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Employee = mongoose.model('Employee')




router.get('/',(req, res)=>{
    res.render('employee/addOrEdit',{
         viewTitle : 'Insert Employee'
    })
})

router.post('/',(req,res)=>{
    if(req.body._id == "")
        insertRecord(req,res);
    else    
        updateRecord(req,res)
}) 

function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'Val    idationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}


function updateRecord(req,res){
    Employee.findOneAndUpdate({_id: req.body._id}, req.body, {new: true}, (err,docs)=>{
        if(!err){
            res.redirect('employee/list')
        }else{
            if(err.name == 'validationError'){
                handleValidationError(err,req.body)
                res.render('employee/addOrEdit',{
                    viewTitle: "Update Employee",
                    name: docs.fullName,
                    email: docs.email,
                    mobile:docs.mobile,
                    city:docs.city
                })
            }
        }
    })
}


router.get('/delete/:id', (req,res)=>{
   Employee.findByIdAndRemove(req.params.id,(err,docs)=>{
       console.log(req.params.id);
       
       if(!err){
        res.redirect('/employee/list');
       }else{
           console.log("Error in Employee deletion", + err);
           
       }
   })  
})

router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {

            const data = {
                list: docs.map((document) => {
                  return {
                    _id: document._id,
                    fullName: document.fullName,
                    email: document.email,
                    mobile: document.mobile,
                    city: document.city
                  }
                })
              }

            res.render("employee/list", {
               
                list: data.list
            });
            //  console.log(docs)
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});






 function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}


//to update
router.get('/:id', (req, res) => {
    console.log('hellooooooooo');
    
    Employee.findById(req.params.id, (err, docs) => {
        if (!err) {

            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                id:docs._id,
                name: docs.fullName,
                email: docs.email,
                mobile:docs.mobile,
                city:docs.city
            });
        }
        console.log(docs)

    });
});


module.exports = router