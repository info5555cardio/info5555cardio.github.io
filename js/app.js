// Create a FHIR client (server URL, patient id in `demo`)

// EXAMPLES: SUSAN CLARK, Jen Quitzon, 

var smart = FHIR.client(config);


function getTextToSpeak() {
    return document.getElementById("givenName").value + "      " + document.getElementById("familyName").value;
}


function getInformation() {

    var givenName = document.getElementById("givenName").value;
    var familyName = document.getElementById("familyName").value;

    var name = {
        type: "Patient",
        query: {
            given: givenName,
            family: familyName
        }
    }

    smart.api.search(name).then(function(r) {
        if (typeof(r.data.entry) != "undefined") { 
            //This is your HTML Output
            $("#info").empty();
            $("#info").append(
                '<h3> Patient Info</h3>'+
                '<p>'+'<b>'+'Gender: '+'</b>'+r.data.entry[0].resource.gender+'</p>'+
                '<p>'+'<b>'+'Birthday: '+'</b>'+r.data.entry[0].resource.birthDate+'</p>'+
                '<p>'+'<b>'+'ID: '+'</b>'+r.data.entry[0].resource.id+'</p>'
            )
            patient_id = r.data.entry[0].resource.id;
            console.log("patient_id is " + patient_id)
        } else{
            $("#info").empty();
            $("#info").append(
                '<p>sorry bro not here</p>'
            )
            // x = undefined;
        }

        var condition = {
            type: "Condition",
            query: { subject: { $or: patient_id } // need this to be the getPatientID() output
            }
        }
    
        smart.api.search(condition).then(function(r) {
    
            if (typeof(r.data.entry) != "undefined") { 
                //This is your HTML Output
                //console.log('bloodPrsure',r.data.entry[0].resource)
                // console.log(r.data.entry[0].resource)
                // $("#info").empty();

                $("#info").append(
                    // '<p>'+'ID: '+r.data.entry[0].resource.subject.reference.split("/")[1]+'</p>'+
                    '<p>'+ '<b>'+'Hypertension Diagnosis(s): ' + '</b>'
                )

                var hypertension = 'No Hypertension'


                for (var i = 0; i < r.data.entry.length; i++) { 

                    console.log(r.data.entry[i].resource.code.text+'; ');

                    if (r.data.entry[i].resource.code.text.includes(('Hypertension'))!=false)
                    {
                        hypertension = 'Hypertensive heart disease positive'
                        
                    

                    }

                    
                  }
                  $("#info").append(
                        // '<p>'+'ID: '+r.data.entry[0].resource.subject.reference.split("/")[1]+'</p>'+
                        //r.data.entry[i].resource.code.text+'; '
                        hypertension)
                  $("#info").append(
                      '</p>'
                )
            } else{
                $("#info").empty();
                $("#info").append(
                    '<p>No Conditions Listed</p>'
                )
            }
        });

        var vitals = {
            type : "Observation",
            query: {
                subject : { $or: patient_id }
            }
        }
    
        smart.api.search(vitals).then(function(r) {
            if (typeof(r.data.entry) != "undefined") { 
                //This is your HTML Output
                console.log('bp',r.data.entry[0].resource)
                // console.log(r.data.entry[0].resource)
                // $("#info").empty();

                $("#info").append(
                    '<p>'+'<b>'+'Cholesterol Level(s): '+ '</b>'
                )

                var seen = []

                for (var i = r.data.entry.length-1; i >= r.data.entry.length-5; i--) {
                    console.log(r.data.entry[i].resource.code.text
                        +': '+r.data.entry[i].resource.valueQuantity.value
                        +' '+r.data.entry[i].resource.valueQuantity.unit)

                    console.log(typeof (r.data.entry[i].resource.valueQuantity) === 'undefined');


                    if (typeof (r.data.entry[i].resource.valueQuantity) !== 'undefined') {
                        if(seen.includes(r.data.entry[i].resource.valueQuantity.unit) === false) {
                        seen.push(r.data.entry[i].resource.code.text
                            +': '+r.data.entry[i].resource.valueQuantity.value
                            +' '+r.data.entry[i].resource.valueQuantity.unit)
                        }
                    }
                }

                // console.log(seen);
                // var cl = false

                for (var x = 0; x < seen.length; x++) {
                    console.log('bp',seen[x]);
                    if (seen[x].includes("Cholesterol")){
                        // cl = true
                        $("#info").append(
                        '<p>'+seen[x]+'<p>'
                    )
                    }
                    
                }
                // if(cl == false)
                // {
                //     console.log("okayokay")
                
                // }
            } else{
                $("#info").empty();
                $("#info").append(
                    '<p>sorry no vitals</p>'
                )
            }
        });

    });
}