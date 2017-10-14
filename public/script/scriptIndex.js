let socket = io();
$(()=>{
  // console.log(MedReminder);

    let reminderlist = $('#reminder');
    let clocked = $('#clocked');
    socket.emit('login','testuser');
    socket.on('MedSchedule',(data)=>{
        console.log(data);
        for(let reminder of data.medsch){
            reminderlist.append($(`<li>${reminder.nameMed}</li>`));
        }
    })
    socket.on('newReminder',(data)=>{
        clocked.append($(`<li>${data}</li>`));
    })
});