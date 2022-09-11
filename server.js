const AddSearchClient = require('addsearch-js-client');

const express=require("express")

const router = express.Router()

const app = express()

const path = require('path');

 

var retData = ""

 

const port = process.env.PORT || 3000;

var client = new AddSearchClient(process.env.keyA, process.env.keyB);

 

router.get("/delete",(request,response) => {

  let id = request.query.id

  console.log(id)

 client.deleteDocument(id)

  .then(resp => {

    console.log(resp)

    response.write(JSON.stringify(resp));

    response.send()

  })

  .catch(error => {

    console.log(error);

  })

})

 

router.get("/idonly",(request,response) => {

  let id = request.query.id

  console.log(id)

  client.getDocument(id)

  .then(resp => {

    response.write(JSON.stringify(resp));

    response.send()

  })

  .catch(error => {

    console.log(error);

  });

})

 

router.get("/info",(request,response) => {

    console.log(request.query)

    let query = request.query.main

    let filename = request.query.filename

    let count = parseInt(request.query.count)

    // 2xjja.nsf^palmettogba.com

    filename = filename.split("^")

    client.setCategoryFilters(filename[1])

    let filter = {

      'or': [

          { 'category': filename[0] },

      ]

    }

    client.setFilterObject(filter)

    client.setPaging(1, count, "relevance", "desc")

    client.search(query, cb)

     setTimeout(function () {

        let max = retData.hits.length-1

        retData.hits.forEach(function(obj,index){

            response.write("{")

            response.write('"url":' + '"' + obj.url + '",')

            response.write('"id":' + '"' + obj.id + '",')

            response.write('"title":' + '"' + obj.title + '",')

            response.write('"allinfo":'  + JSON.stringify(obj) )

           index == max ? response.write("}") : response.write("},")

        })

        response.send()

      }, 700);

})

 

app.use("/",router)

 

app.get('/', function(req, res) {

  res.sendFile(path.join(__dirname, '/index.html'));

});

 

app.listen(port);

console.log('Server started at http://localhost:' + port);




// search testing

var cb = function(res) {

     retData = res

     console.log(res)

  }