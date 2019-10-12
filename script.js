/*---------------------------------------------------------------------------------------
                                    ModelController     
/*---------------------------------------------------------------------------------------*/
var ModelController = (function () {

    const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        limitDraw = [8, 15, 22, 28, 36, 43];

    var monthDimension = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
         paintCalendarDays = true;
    
    var data = {
        htmlToDraw: ""
    };

    // Consumes REST api synchronous
    function getMonthHolidays(y, m, c = 'US') {

        var API_KEY = 'e33c311e-3ee8-41ba-a7b3-799fb453c8cc';
        var APIurl = `https://holidayapi.com/v1/holidays?country=${c}&year=${y}&month=${m}&key=${API_KEY}`;

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
                    console.log("Error", xhr.statusText);
                }
            }
        }

        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };

        xhr.send(null);
    }

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

    function isHoliday(d) {
        for (var i = 0; i < data.holidays.length; i++) {
            if (data.holidays[i].date.split("-")[2] == d)
                return data.holidays[i].name;
        }
        return false;
    }


    // Draw Calendar
    function generateCalendarHTML(inputDate, daystoDraw, countryCode, htmlText) {


        var month = inputDate.getMonth(),
            year = inputDate.getFullYear(),
            initialDayMonth = getFirstDayOfTheMonth(inputDate),
            initialDayToDraw = getInitialDayToDraw(inputDate),
            holidayName = -1,
            title = "",
            style = "weekdays",
            rowClosing = '</tr><tr align="center">',
            cellValue, htmlText;

        getMonthHolidays(year, month, countryCode);


        htmlText += '<div><table cols="7" cellpadding="0" cellspacing="0" class="month-container"><tr align="center" class="daysofweek">';

        // Calendar days label header
        if(paintCalendarDays){
            for (var s = 0; s < 7; s++) htmlText += '<td class="day-label">' + "SMTWTFS".substr(s, 1) + '</td>';
            paintCalendarDays = false;
        }   

        htmlText += rowClosing;

        // Month name header
        htmlText += '<td colspan="7" align="center" class="month-label">' + monthsArray[month] + ' - ' + year + '</td></tr><tr align="center">' + rowClosing;

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

        // If there are days to draw left, then call drawCalendar recursively
        if (daystoDraw > 0) {
            var nextMonth = month === 11 ? 0 : month + 1,
                year = nextMonth === 1 ? year + 1 : year,
                d = new Date(year, nextMonth, 01);

            generateCalendarHTML(d, daystoDraw, countryCode, htmlText);
        } else {
            data.htmlToDraw = htmlText;
        }
    }

    function getHtml() {
        return data.htmlToDraw;
    }

    return {
        generateCalendarHTML: generateCalendarHTML,
        getHtml: getHtml
    }
})();

/*---------------------------------------------------------------------------------------
                                        UIController     
/*---------------------------------------------------------------------------------------*/
var UIController = (function (doc) {

    var DOM_countryCode = doc.getElementById("countryCode"),
        DOM_dateSelected = doc.getElementById("date"),
        DOM_numberOfDays = doc.getElementById("numberOfDays"),
        DOM_displayCalendar = ".display-calendar",
        DOM_warningContainer = ".warning-container";


    function drawCalendar(htmlText) {
        //insert the calendar into html
        doc.querySelector(DOM_displayCalendar).insertAdjacentHTML("beforeend", htmlText);
    }


    function clearPage() {

        /*numberOfDays.value = "";
        countryCode.value = "";
        dateSelected.value = "";*/

        var elem = doc.querySelector(DOM_displayCalendar);
        elem.innerHTML = "";
        return false;
    }

    function validateInput() {

        var isValid = true;
        var message = "";

        if (!DOM_numberOfDays.checkValidity()) {
            message += "<p>You have to enter a valid number of days.</p>"
        }
        if (!DOM_countryCode.checkValidity()) {
            message += "<p>You have to enter a valid country code.</p>"
        }
        if (!DOM_dateSelected.checkValidity()) {
            message += "<p>You have to enter a valid date.</p>"
        }

        if (message.length > 0) {
            isValid = false;
            doc.querySelector(DOM_warningContainer).innerHTML = message;

            doc.querySelector(DOM_warningContainer).style.display = "block";
        } else {
            doc.querySelector(DOM_warningContainer).style.display = "none";
        }

        return isValid;
    }

    function getInput() {
        var date = DOM_dateSelected.value,
            inputsDate = new Date(date);

        inputsDate.setDate(inputsDate.getDate() + 1)

        return {
            numberOfDays: DOM_numberOfDays.value,
            countryCode: DOM_countryCode.value,
            inputDate: inputsDate
        }
    }

    return {
        clearPage: clearPage,
        getInput: getInput,
        validateInput: validateInput,
        drawCalendar: drawCalendar
    }

})(document);

/*---------------------------------------------------------------------------------------
                                        AppController     
/*---------------------------------------------------------------------------------------*/
var AppController = (function (win, doc, ModelController, UIController) {

    var setupEventListeners = function () {
        //var DOM = UIController.getDOMStrings();        

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                GenerateCalendar();
            }
        });

        doc.getElementById("btn-generate").addEventListener("click", function () {
            GenerateCalendar();
        });
    }

    function GenerateCalendar() {
        UIController.clearPage();

        if (UIController.validateInput()) {

            // 1- Get input
            var input = UIController.getInput();

            // 2- Generate the html for the calendars
            ModelController.generateCalendarHTML(input.inputDate, input.numberOfDays, input.countryCode, "");

            // 3- Display the calendars
            UIController.drawCalendar(ModelController.getHtml());
        }
    }

    return {
        init: function () {
            console.log("app started");
            setupEventListeners();
        }
    }


})(window, document, ModelController, UIController);

AppController.init();