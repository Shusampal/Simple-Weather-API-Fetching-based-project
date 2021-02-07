const http = require('http');
const fs = require('fs');
const requests = require("requests");

var homeFile = fs.readFileSync('home.html','utf-8');
function replaceValue(currTemp,temp_min,temp_max,city,country,temp_status,temp,temp2){
    homeFile = homeFile.replace('{%temp%}',currTemp);
    homeFile = homeFile.replace('{%temp_min%}',temp_min);
    homeFile = homeFile.replace('{%temp_max%}',temp_max);
    homeFile = homeFile.replace('{%city%}',city);
    homeFile = homeFile.replace('{%country%}',country);
    homeFile = homeFile.replace('{%temp_status%}',temp_status);
    homeFile = homeFile.replace('"{%tempH%}"',temp);
    homeFile = homeFile.replace('{%tempHH%}',temp2);
    return homeFile;
};

const server = http.createServer((req,res)=>{
    if(req.url == "/")
    {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Delhi,in&appid=019e4f24f851f9ec78ddc828de419a2e').on('data',(chunk) =>{
            const objData = JSON.parse(chunk);
            const currTemp =  Math.round(objData.main.temp - 273.15);
            const temp_min =  Math.round(objData.main.temp_min - 273.15);
            const temp_max =  Math.round(objData.main.temp_max - 273.15);
            const city = objData.name;
            const country = objData.sys.country;
            const temp_status = objData.weather[0].main;
            const temp = objData.weather[0].main;
            const temp2 = objData.weather[0].main;
            const file = replaceValue(currTemp,temp_min,temp_max,city,country,temp_status,temp,temp2);
            res.write(file);
            res.end();
        })
        
    }
});

server.listen(8000,'127.0.0.1',()=>console.log("Listening at 8000"));


