// Create a FHIR client (server URL, patient id in `demo`)
var smart = FHIR.client(config);


function fetchComorbidities(){
  $("#table-data").empty();
  var selected_conditions = [];

  if(document.getElementById("abdominal-pain").checked){
    selected_conditions.push("21522001");
  }
  if(document.getElementById("diarrhea").checked){
    selected_conditions.push("62315008");
  }
  if(document.getElementById("constipation").checked){
    selected_conditions.push("14760008");
  }

  console.log(selected_conditions);

  smart.api.search({
    type: "Condition",
    query: {code : {$or : selected_conditions}}
  }).then(function(r){
    var patients = [];
    for (var i in r.data.entry){
      patients.push(r.data.entry[i].resource.subject.reference.split("/")[1]);
      // console.log(r.data.entry[i].resource.subject.reference.split("/")[1]);
    }
    console.log(patients);
     // console.log(JSON.stringify(r.data.entry, null, 2));

     smart.api.search({
       type: "Condition",
       query: {'subject' : {$or : patients}}
     }).then(function(r){
       var conditions = {};
       for (var i in r.data.entry){
         var condition_code = r.data.entry[i].resource.code.coding[0].code;
         var condition_name = r.data.entry[i].resource.code.coding[0].display;
         console.log(condition_code);
         if (condition_code in conditions){
           conditions[condition_code]["count"] += 1;
         } else {
           conditions[condition_code] = {
             "count" : 1,
             "name" : condition_name
           };
         }
       }
       console.log(JSON.stringify(conditions, null, 2));
       for(var key in conditions){
         $("#table-data").append(
           '<tr>'+
               '<td>'+conditions[key]["name"]+'</td>'+
               '<td>'+key+'</td>'+
               '<td>'+conditions[key]["count"]+'</td>'+
           '</tr>'
         )
       }
     });
  });
}

// var conditions = fetchComorbidities(["14760008", "62315008", "21522001"])