let request = require('request');

//Daten
let ip = 'IP DES REPETIER-SERVERS'
let port = '3344'
let api = 'API-SCHLÜSSEL';
let path = '0_userdata.0.RepetierConnect.';

//Ab hier NICHTS ändern
let cmdJobInfo = "listPrinter";
let cmdTempInfo = "stateList";
let urlJobInfo = 'http://' + ip + ':' + port + '/printer/api/?a=' + cmdJobInfo + '&apikey=' + api;
let urlTempInfo = 'http://' + ip + ':' + port + '/printer/api/?a=' + cmdTempInfo + '&apikey=' + api;

createState(path + "urlJobInfo", urlJobInfo, {
                            read    : true,
                            write   : false,
                            name    : "JobInfo-URL",
                            type    : "string"
                        })

createState(path + "urlTempInfo", urlTempInfo, {
                            read    : true,
                            write   : false,
                            name    : "TempInfo-URL",
                            type    : "string"
                        })

function getJobInfo(){
    request(urlJobInfo, function(error,response, body){
        if(error){
            console.log(error);        
        } else {
            let data = JSON.parse(body);  
            for (let i = 0; i < data.length; i++){
                if (!existsState(path + data[i].slug + '.' + 'active')){
                    createState(path + data[i].slug + '.' + 'name', data[i].name, {
                            read    : true,
                            write   : false,
                            name    : "Druckername",
                            type    : "string"
                        })
                    createState(path + data[i].slug + '.' + 'online', data[i].online, {
                            read    : true,
                            write   : false,
                            name    : "Onlinestatus",
                            type    : "boolean"
                        })
                    createState(path + data[i].slug + '.' + 'active', data[i].active, {
                            read    : true,
                            write   : false,
                            name    : "Aktivstatus",
                            type    : "boolean"
                        })

                    createState(path + data[i].slug + '.' + 'job.jobname', '-', {
                            read    : true,
                            write   : false,
                            name    : "aktueller Job",
                            type    : "string"
                        })
                    createState(path + data[i].slug + '.' + 'job.percent', '0', {
                            read    : true,
                            write   : false,
                            name    : "Jobstatus in %",
                            type    : "number",
                            unit    : "%"
                        })
                    createState(path + data[i].slug + '.' + 'job.linesTotal', '0', {
                            read    : true,
                            write   : false,
                            name    : "G-Code Zeilen maximal",
                            type    : "number"
                        })
                    createState(path + data[i].slug + '.' + 'job.linesSend', '0', {
                            read    : true,
                            write   : false,
                            name    : "G-Code Zeilen gesendet",
                            type    : "number"
                        })
                    createState(path + data[i].slug + '.' + 'job.printTimeTotal', '0', {
                            read    : true,
                            write   : false,
                            name    : "Druckzeit maximal (hh:mm:ss)",
                            type    : "string"
                        })
                    createState(path + data[i].slug + '.' + 'job.printTime', '0', {
                            read    : true,
                            write   : false,
                            name    : "Druckzeit aktuell (hh:mm:ss)",
                            type    : "string"
                        })
                    createState(path + data[i].slug + '.' + 'job.zLayer', '0', {
                            read    : true,
                            write   : false,
                            name    : "Z-Layer maximal",
                            type    : "number"
                        })

                    createState(path + data[i].slug + '.' + 'temp.extruder.target', '0', {
                            read    : true,
                            write   : false,
                            name    : "Extruder-Temperatur SOLL",
                            type    : "number",
                            unit    : "°C"
                        })
                    createState(path + data[i].slug + '.' + 'temp.extruder.actual', '0', {
                            read    : true,
                            write   : false,
                            name    : "Extruder-Temperatur IST",
                            type    : "number",
                            unit    : "°C"
                        })
                    createState(path + data[i].slug + '.' + 'temp.bed.target', '0', {
                            read    : true,
                            write   : false,
                            name    : "Bett-Temperatur SOLL",
                            type    : "number",
                            unit    : "°C"
                        })
                    createState(path + data[i].slug + '.' + 'temp.bed.actual', '0', {
                            read    : true,
                            write   : false,
                            name    : "Bett-Temperatur IST",
                            type    : "number",
                            unit    : "°C"
                        })
                } else {
                    setState(path + data[i].slug + '.' + 'name', data[i].name, true);
                    setState(path + data[i].slug + '.' + 'online', (data[i].online == 1) ? true : false, true);
                    setState(path + data[i].slug + '.' + 'active', data[i].active, true);

                    if(data[i].job != 'none'){
                        setState(path + data[i].slug + '.' + 'job.jobname', data[i].job, true);
                        setState(path + data[i].slug + '.' + 'job.percent', Number((data[i].done).toFixed(2)), true);
                        setState(path + data[i].slug + '.' + 'job.linesTotal', Number(data[i].totalLines), true);
                        setState(path + data[i].slug + '.' + 'job.linesSend', Number(data[i].linesSend), true);
                        setState(path + data[i].slug + '.' + 'job.printTimeTotal', umrechnen(data[i].printTime), true);
                        setState(path + data[i].slug + '.' + 'job.printTime', umrechnen(data[i].printedTimeComp), true);
                        setState(path + data[i].slug + '.' + 'job.zLayer', Number(data[i].ofLayer), true);
                    } else{
                        setState(path + data[i].slug + '.' + 'job.jobname', "-", true);
                        setState(path + data[i].slug + '.' + 'job.percent', Number('0'), true);
                        setState(path + data[i].slug + '.' + 'job.linesTotal', Number('0'), true);
                        setState(path + data[i].slug + '.' + 'job.linesSend', Number('0'), true);
                        setState(path + data[i].slug + '.' + 'job.printTimeTotal', "0", true);
                        setState(path + data[i].slug + '.' + 'job.printTime',  "0", true);
                        setState(path + data[i].slug + '.' + 'job.zLayer', Number('0'), true);
                    }

                    getTempInfo(data[i].slug);
                }
            }
        }    
    });
}

function getTempInfo(slug){
    request(urlTempInfo, function(error,response, body){
        if(error){
            console.log(error);        
        } else {
            let data = JSON.parse(body);  

            setState(path + slug + '.' + 'temp.extruder.actual', Number((data[slug].extruder[0].tempRead).toFixed(2)), true);
            setState(path + slug + '.' + 'temp.extruder.target', Number((data[slug].extruder[0].tempSet).toFixed(2)), true);
            
            setState(path + slug + '.' + 'temp.bed.actual', Number((data[slug].heatedBeds[0].tempRead).toFixed(2)), true);
            setState(path + slug + '.' + 'temp.bed.target', Number((data[slug].heatedBeds[0].tempSet).toFixed(2)), true);
            
        }
    });
}

function umrechnen(allSeconds){
    let totalSeconds = Math.round(allSeconds);
    let hours = ("00" + Math.floor(totalSeconds / 3600)).slice(-2);
    totalSeconds %= 3600;
    let minutes = ("00" + Math.floor(totalSeconds / 60)).slice(-2);
    let seconds = ("00" + totalSeconds % 60).slice(-2);
    return (hours + ':' + minutes + ':' + seconds);
}

setInterval(function() {
    getJobInfo();
}, 10000);      

    
