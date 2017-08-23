// main function
(function () {

    const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var monthDimension = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var btnGenerate = document.getElementById("btn-generate");

    function getMonthDays(month, year) {

        var totDays = -1;
        if (month === 1) {
            totDays = (((year % 100 != 0) &&
                    (year % 4 == 0)) ||
                (year % 400 == 0)) ? 29 : 28;
        } else {
            totDays = monthDimension[month];
        }
        return totDays;

    }

    function getFirstDayOfTheMonth(date) {
        return date.getDay() + 1;
    }

    //variables
    var limitDraw = [8, 15, 22, 28, 36, 43];



    function getInitialDayToDraw(date) {
        var day = -1;
        var dateStr = date.toString();
        //console.log(dateStr);
        day = dateStr.split(" ")[2];
        //console.log(day);
        return day;
    }




    btnGenerate.addEventListener("click", function () {

        var date = document.getElementById("date").value;

        var numberOfDays = document.getElementById("numberOfDays").value;
        var countryCode = document.getElementById("countryCode").value;
        var inputDate = new Date(date);
        // add a day
        inputDate.setDate(inputDate.getDate() + 1);

        //Do Calendars
        //getWeekdaysHeader();
        displayCalendar(inputDate, numberOfDays, countryCode);
    });



    function displayCalendar(inputDate, numberOfDays, countryCode) {




        /*console.log("iD: " + inputDate + "\n initialDayMonth: "+initialDayMonth + "\n numbdays: "+numberOfDays+"\n month: "+month+" "+year+"\n idtd: "+initialDayToDraw);*/


        drawCalendar(inputDate, numberOfDays);

    }

    var data = [];
    
    function getMonthHolidays(y, m) {
        
        var xhr = new XMLHttpRequest();        
        var APIurl = "https://holidayapi.com/v1/holidays?country=US&year="+y+"&month="+m+"&key=d7067658-2852-4cb4-b0df-56daac7cbf80";
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {

                data = JSON.parse(xhr.response);
                
            }
        }
        xhr.open('GET', APIurl, false);
        xhr.send(null);
    }

    
    function isHoliday(d){
        
        for(var i = 0; i< data.holidays.length; i++){
            if(data.holidays[i].date.split("-")[2] == d)
                return data.holidays[i].name;
        }
        
        return false;
    }
    
    
    function drawCalendar(inputDate, daystoDraw) {
        var style = "weekdays";

        var month = inputDate.getMonth();
        var year = inputDate.getFullYear();
        
        getMonthHolidays(year, month);
        

        var initialDayMonth = getFirstDayOfTheMonth(inputDate);
        var initialDayToDraw = getInitialDayToDraw(inputDate);
        
        var holidayName = -1;
        var title ="";

        var cellValue;
        var t = '<div><table cols="7" cellpadding="0" cellspacing="0" class="month-container"><tr align="center" class="daysofweek">';

        for (s = 0; s < 7; s++) t += '<td class="day-label">' + "SMTWTFS".substr(s, 1) + '</td>';

        t += '</tr><tr align="center">';


        t += '<td colspan="7" align="center" class="month-label">' + monthsArray[month] + ' - ' + year + '</td></tr><tr align="center">';
        t += '</tr><tr align="center">';


        for (i = 1; i <= 42; i++) {

            if (cellValue === '&nbsp;' && (i > initialDayMonth) && limitDraw.indexOf(i) > -1) {
                break;
            }

            if ((i >= initialDayMonth) && (initialDayToDraw <= getMonthDays(month, year)) && (daystoDraw > 0)) {
                cellValue = initialDayToDraw;
                            
                
                daystoDraw--;
                initialDayToDraw++;
                
                
                holidayName = isHoliday(initialDayToDraw);
                
                
                if(holidayName){
                   style = "holiday";
                    title = 'title="'+holidayName+'"';
               }else{
                    style = ((i) % 7 == 0) || ((i - 1) % 7 == 0) ? "weekend" : "weekdays";
                   title = "";
               }
                
                
                
                
                
            } else {
                cellValue = '&nbsp;';
                style = "invalid-day";
            }

            //= ((i > dayToStart) && (i <= monthDimension) ) ? i : '&nbsp;';



            t += '<td class="' + style + '"'+title+'">' + cellValue + '</td>';

            if ((i) % 7 == 0)
                t += '</tr><tr align="center">';

        }
        t += '</tr></table></div>';

        document.querySelector(".display-calendar").insertAdjacentHTML("beforeend", t);

        if (daystoDraw > 0) {
            var nextMonth = month === 11 ? 1 : month + 1;
            var year = nextMonth === 1 ? year + 1 : year;

            var d = new Date(year, nextMonth, 01);

            drawCalendar(d, daystoDraw);
        }
    }


})();


/*
function buildCal(currentMonth, y, borderSize) {

    //relocating variables
    const main = "display-calendar";
    const currentMonthonth = "currentMonthonth";
    const daysofweek = "daysofweek";
    const days = "days";
    var borderSize = borderSize;

    // KFC added
    var daysSelected = 17;
    var limitDayToDraw = [8, 15, 22, 28, 36, 43];


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




    var t = '<div class="' + main + '"><table class="' + main + '" cols="7" cellpadding="0" border="' + borderSize + '" cellspacing="0"><tr align="center">';

    t += '<td colspan="7" align="center" class="' + currentMonthonth + '">' + monthsArray[currentMonth - 1] + ' - ' + y + '</td></tr><tr align="center">';

    // for thta draws the header
    //for (s = 0; s < 7; s++) t += '<td class="' + daysofweek + '">' + "SMTWTFS".substr(s, 1) + '</td>';
    t += '</tr><tr align="center">';


    // For that draws the calendar
    for (i = 1; i <= 42; i++) {


        if (x === '&nbsp;' && (i > inputDate.monthStart) && limitDayToDraw.indexOf(i) > -1) {
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

}*/
