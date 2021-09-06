

const express = require('express');

const cors = require('cors');
require ('dotenv').config() ;

const axios = require('axios') ;


const PORT = process.env.PORT  

var mongoose = require("mongoose");  

const server = express(); 
server.use(cors ()) ; 
server.use(express.json()); 

//////////////////////  







  



server.listen(PORT,() => {

    console.log(`'Im listening  ${PORT}`);  
})  
 
 






 async function CreptoApi (req,res) {    /// 

    console.log('inside creptoApi');  

    const URL = ` https://crypto-explorer.herokuapp.com/crypto-list/ ` 

    let Crepto =  await  axios.get(URL)  

    // console.log(Crepto.data);    

     let CreptoArray = Crepto.data.map(crepto => {
      
        return new Money (crepto)  
        
        
      }) 

    //   console.log(CreptoArray);

      res.send(CreptoArray) 
   

}




class Money {
    constructor (data) { 
        this.title= data.title
        this.image_url= data. image_url 
        this.description = data.description 
       
    }
}



////////////////////////////////////////////// part one  ///////////////////////////////// 

mongoose.connect("mongodb://localhost:27017/crepto", { useNewUrlParser: true }); 


//// schema 

let  creptoSchema = new mongoose.Schema({                 
  
  

    title : String ,

    image_url : String , 

    description : String ,

    email : String 

  });


  /// model 

  let creptoModel = mongoose.model("crepto", creptoSchema); 





// routs 

server.get('/creptoes',CreptoApi)  

server.post('/Addcreptoes' ,AddFAV)   








  async function AddFAV (req,res) { 


      // const newCrepto = new creptoModel ({
          
      //     title : title ,
  
      //     image_url : image_url , 
      
      //     description : description ,
      
      //     email : email 
  
      // })
  
      // newCrepto.save() 
     
    

    const { title , image_url , description, email  } = req.body    



    await creptoModel.create({  title , image_url , description , email});    

    creptoModel.find({email},function(err,addCrepto){
        if(err){ 
            console.log('error in getting the data');  
        }else { 
            console.log(addCrepto); 
            res.send(addCrepto)   
        }
    }
    )  

} 


/////////////////////////////////////// 

server.get('/FAvcreptoes',getCrepto)  

function  getCrepto (req,res) {

    console.log('get cerpto');
    
    let Email = req.query.email 

    creptoModel.find({ } ,  function (err,getData) {

            res.send(getData) 
    } )
}


///////////////////////////////  

server.delete('/Deletecreptoes/:id', DeleteHandler )


function DeleteHandler (req,res ) { 

    console.log('inside delet');
    let id = req.params.id

    let Email = req.query.email 

    creptoModel.deleteOne({  _id : id } , function (err,data) {

        creptoModel.find({ } ,  function (err,NewData) {

            res.send(NewData)   
    } )
    })

} 


