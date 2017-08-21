function buildCal(currentMonth, y, borderSize) {


    //relocating variables
    const currentMonthain = "currentMonthain";
    const currentMonthonth = "currentMonthonth";
    const daysofweek = "daysofweek";
    const days = "days";
    var borderSize = borderSize;
    
    // KFC added
    var daysSelected = 17;
    var limitDayToDraw = [8,15,22,28,36,43];
    

    var monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var dim = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var inputDate = new Date(y, currentMonth - 1, 1); //DD replaced line to fix date bug when current day is 31st
    
        

    //Day the month starts
    inputDate.monthStart = inputDate.getDay() + 1; //DD replaced line to fix date bug when current day is 31st

    
    
    var todaydate = new Date() //DD added
    var scanfortoday = (y == todaydate.getFullYear() && currentMonth == todaydate.getMonth() + 1) ? todaydate.getDate() : 0 //DD added
    
    
    dim[1] = (((inputDate.getFullYear() % 100 != 0) && 
               (inputDate.getFullYear() % 4 == 0)) || 
              (inputDate.getFullYear() % 400 == 0)) ? 29 : 28;
    
    
    

    var t = '<div class="' + currentMonthain + '"><table class="' + currentMonthain + '" cols="7" cellpadding="0" border="' + borderSize + '" cellspacing="0"><tr align="center">';

    t += '<td colspan="7" align="center" class="' + currentMonthonth + '">' + monthsArray[currentMonth - 1] + ' - ' + y + '</td></tr><tr align="center">';

    // for thta draws the header
    //for (s = 0; s < 7; s++) t += '<td class="' + daysofweek + '">' + "SMTWTFS".substr(s, 1) + '</td>';
    t += '</tr><tr align="center">';
    
    
    // For that draws the calendar
    for (i = 1; i <= 42; i++) {
        
        
        
        if(x === '&nbsp;' && (i > inputDate.monthStart) && limitDayToDraw.indexOf(i) > -1){
            console.log(i);
            break;
        }
           
           
        var x = ((i - inputDate.monthStart >= 0) && 
                 (i - inputDate.monthStart < dim[currentMonth - 1])) ? i - inputDate.monthStart + 1 : '&nbsp;';
        
        //if (x == scanfortoday) //DD added
        //    x = '<span id="today">' + x + '</span>' //DD added
        
        t += '<td class="' + days + '">' + x + '</td>';
        
        if ((i) % 7 == 0) 
             t += '</tr><tr align="center">';
        
        
            
    }
    return t += '</tr></table></div>';    
  
}

function getWeekdaysInitials(currentMonthonth, monthsArray, currentMonth, y) {
    return '<td colspan="7" align="center" class="' + currentMonthonth + '">' + monthsArray[currentMonth - 1] + ' - ' + y + '</td></tr><tr align="center">'
}
