// main function
(function (win, doc) {

    const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        limitDraw = [8, 15, 22, 28, 36, 43],
        DOM_countryCode = doc.getElementById("countryCode"),
        DOM_dateSelected = doc.getElementById("date"),
        DOM_numberOfDays = doc.getElementById("numberOfDays");

    var monthDimension = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var data = [];


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

    function getInitialDayToDraw(date) {
        var day = -1,
            dateStr = date.toString();

        day = dateStr.split(" ")[2];
        return day;
    }

    function getMonthHolidays(y, m, c) {

        //var APIurl = "https://holidayapi.com/v1/holidays?country=" + c + "&year=" + y + "&month=" + m;

        var APIurl = "https://holidayapi.com/v1/holidays?country=" + c + "&year=" + y + "&month=" + m + "&key=d7067658-2852-4cb4-b0df-56daac7cbf80";

        var xhr = new XMLHttpRequest();
        xhr.open('GET', APIurl, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    try {
                        data = JSON.parse(xhr.response);
                    } catch (e) {
                        alert(e.toString());
                    }
                } else {
                    alert(xhr.statusText);
                }


                /*
                200Success! Everything is A-OK
400Something is wrong on your end
401Unauthorized (did you remember your API key?)
402Payment required (only historical data available is free)
403Forbidden (this API is HTTPS-only)
429Rate limit exceeded
500OH NOES!!~! Something is wrong on our end
                */
            }
        }

        xhr.send(null);
    }


    function isHoliday(d) {

        for (var i = 0; i < data.holidays.length; i++) {
            if (data.holidays[i].date.split("-")[2] == d)
                return data.holidays[i].name;
        }

        return false;
    }


    function drawCalendar(inputDate, daystoDraw, countryCode) {

        var month = inputDate.getMonth(),
            year = inputDate.getFullYear(),
            initialDayMonth = getFirstDayOfTheMonth(inputDate),
            initialDayToDraw = getInitialDayToDraw(inputDate),
            holidayName = -1,
            title = "",
            style = "weekdays",
            rowClosing = '</tr><tr align="center">',
            cellValue, htmlText;

        getMonthHolidays(year, month);


        htmlText = '<div><table cols="7" cellpadding="0" cellspacing="0" class="month-container"><tr align="center" class="daysofweek">';

        // Calendar days labe header
        for (var s = 0; s < 7; s++) htmlText += '<td class="day-label">' + "SMTWTFS".substr(s, 1) + '</td>';

        htmlText += rowClosing;

        // Month name header
        htmlText += '<td colspan="7" align="center" class="month-label">' + monthsArray[month] + ' - ' + year + '</td></tr><tr align="center">';

        htmlText += rowClosing;


        // Days draw
        for (i = 1; i <= 42; i++) {

            //Closing rules
            if (cellValue === '&nbsp;' && (i > initialDayMonth) && limitDraw.indexOf(i) > -1) {
                break;
            }


            if ((i >= initialDayMonth) &&
                (initialDayToDraw <= getMonthDays(month, year)) &&
                (daystoDraw > 0)) {
                try {
                    // Valid day
                    cellValue = initialDayToDraw;
                    daystoDraw--;
                    initialDayToDraw++;

                    // Holiday searching
                    holidayName = isHoliday(initialDayToDraw);

                    if (holidayName) {
                        style = "holiday";
                        title = 'title="' + holidayName + '"';
                    } else {
                        style = ((i) % 7 == 0) || ((i - 1) % 7 == 0) ? "weekend" : "weekdays";
                        title = "";
                    }
                } catch (e) {
                    alert(e.message);
                }
            } else {
                //invalid day
                cellValue = '&nbsp;';
                style = "invalid-day";
            }

            htmlText += '<td class="' + style + '"' + title + '">' + cellValue + '</td>';

            if ((i) % 7 == 0)
                htmlText += rowClosing;

        }
        htmlText += '</tr></table></div>';

        //insert the calendar into html
        doc.querySelector(".display-calendar").insertAdjacentHTML("beforeend", htmlText);

        // If there are days to draw left, then call drawCalendar recursively
        if (daystoDraw > 0) {
            var nextMonth = month === 11 ? 0 : month + 1,
                year = nextMonth === 1 ? year + 1 : year,
                d = new Date(year, nextMonth, 01);

            drawCalendar(d, daystoDraw, countryCode);
        }
    }

    function clearPage() {

        /*numberOfDays.value = "";
        countryCode.value = "";
        dateSelected.value = "";*/
        
        var elem = doc.querySelector(".display-calendar");
        elem.innerHTML = "";
        return false;
    }

    function validateInput() {

        var isValid = true;
        var message = "";
        
        if(!DOM_numberOfDays.checkValidity()){
            message += "<p>You have to enter a valid number of days.<p>"
        }
        if(!DOM_countryCode.checkValidity()){
            message += "<p>You have to enter a valid Country code.<p>"
        }
        if(!DOM_dateSelected.checkValidity()){
            message += "<p>You have to enter a valid date.<p>"
        }
        
        if(message.length > 0){
            isValid = false;
            doc.querySelector(".warning-container").innerHTML = message;
            
            doc.querySelector(".warning-container").style.display = "block";
        }else{
            doc.querySelector(".warning-container").style.display = "none";
        }
        
        return isValid;
    }

    win.onload = function () {

        var btnGenerate = doc.getElementById("btn-generate");

        btnGenerate.addEventListener("click", function () {            

            clearPage();
            
            if (validateInput()) {               
                
                var date = DOM_dateSelected.value,
                    numberOfDays = DOM_numberOfDays.value,
                    countryCode = DOM_countryCode.value,
                    inputDate = new Date(date);

                inputDate.setDate(inputDate.getDate() + 1);

                drawCalendar(inputDate, numberOfDays, countryCode);
            }

        });
    }


})(window, document);
