// main function
(function () {

    const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const limitDraw = [8, 15, 22, 28, 36, 43];
    var monthDimension = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var data = [];

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
        xhr.open('GET', APIurl, false);
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
        var style = "weekdays";

        var month = inputDate.getMonth();
        var year = inputDate.getFullYear();

        getMonthHolidays(year, month);


        var initialDayMonth = getFirstDayOfTheMonth(inputDate);
        var initialDayToDraw = getInitialDayToDraw(inputDate);

        var holidayName = -1;
        var title = "";

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


                if (holidayName) {
                    style = "holiday";
                    title = 'title="' + holidayName + '"';
                } else {
                    style = ((i) % 7 == 0) || ((i - 1) % 7 == 0) ? "weekend" : "weekdays";
                    title = "";
                }





            } else {
                cellValue = '&nbsp;';
                style = "invalid-day";
            }

            //= ((i > dayToStart) && (i <= monthDimension) ) ? i : '&nbsp;';



            t += '<td class="' + style + '"' + title + '">' + cellValue + '</td>';

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

    btnGenerate.addEventListener("click", function () {

        var date = document.getElementById("date").value;

        var numberOfDays = document.getElementById("numberOfDays").value;
        var countryCode = document.getElementById("countryCode").value;
        var inputDate = new Date(date);
        // add a day
        inputDate.setDate(inputDate.getDate() + 1);

        //Do Calendars
        //getWeekdaysHeader();
        drawCalendar(inputDate, numberOfDays, countryCode);
    });


})();
