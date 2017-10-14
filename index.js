const MedicineSchedule = require('./schedule');
const schedule = require('node-schedule');
const express = require('express');
// const exphbs = require('express-handlebars');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio.listen(server);



// app.engine('handlebars',exphbs({defaultLayout: 'main',extname: '.hbs'}));
// app.set('view engine','ejs');
// app.set('views',__dirname+'/views');


// function fetchMedSchedule() {
//     var MedSchedule = [];
//     console.log(MedSchedule);
//     console.log('*****');
//     for (let i of MedicineSchedule.medicine) {
//         MedSchedule.push(FetchData(i));
//     }
//     console.log("returning MedSchedule");
//     console.log(MedSchedule);
//     console.log('****');
//     return MedSchedule;
// }
// function FetchData(i) {
//     console.log(i.minutes + ' ' + i.hour + ' * * *');
//     return new Promise((resolve,reject)=>{
//             resolve(schedule.scheduleJob(i.minutes + ' ' + i.hour + ' * * *', () => {
//             console.log('Take Medicine'+i.medName);
//             }))
//     })
// }




var medsch = MedicineSchedule.medicine;
console.log(medsch);
var users = {};
io.on('connection',(socket)=>{
    console.log('Now fetch Schedule');
    socket.on('login',(username)=>{
        console.log("Fetch the schedule for "+socket.id);
        users[socket.id] = username;
        console.log("Sending:"+medsch);
        socket.emit('MedSchedule',{username, medsch})
    });

    socket.on('eaten',(data)=>{
        medsch[data].status=true;
        io.emit('updatesch',medsch)
    });

    for(let i of MedicineSchedule.medicine){
        schedule.scheduleJob(i.minutes+' '+i.hour+' * * *',()=>{
            console.log('Take your med:'+i.nameMed);
            io.emit('newReminder',i.nameMed);
        })
    }
});



app.use('/',express.static(__dirname+'/public'));

app.get('/',(req,res,next)=>{
   res.redirect('/dashboard');
});

app.get('/dashboard',(req,res,next)=>{

    // let x = fetchMedSchedule();
    // console.log('Reached x');
    // console.log(x);
    // Promise.all(x).then((MedSchedule)=>{
    //     console.log(MedSchedule);
    //     console.log('Reached after Medschedule');
    //     res.render('index',{Med:MedSchedule});
    // }).catch((err)=>{
    //     console.log(err);
    // });

    // var MedicineReminder = [];

    res.sendFile(__dirname+'/public/index.html')

    // res.render('index',{Med: MedicineReminder})
});

let j = schedule.scheduleJob('22 15 * * *',()=>{
    console.log("Reached 17th");
});


server.listen(8080, function () {
    console.log("Server started on http://localhost:8080");
});