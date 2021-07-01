var yearFirst = 2018;
var yearLast = 2021;
var monthLast = 6;

function pageLoaded()
{
    var yearSelect = document.seasonForm.yearSelect;
    var monthSelect = document.seasonForm.monthSelect;

    for(var i = yearFirst; i <= yearLast; i++)
            yearSelect.options[i-yearFirst] = new Option(i);

    yearSelect.selectedIndex = yearSelect.options.length - 1;
    changeMonthSelecter();
    monthSelect.selectedIndex = monthSelect.options.length - 1;
}

function changeMonthSelecter()
{
    var yearSelect = document.seasonForm.yearSelect;
    var monthSelect = document.seasonForm.monthSelect;
    var defaultMonth = monthSelect.value;
    monthSelect.options.length = 0;
         
    if (yearSelect.value == yearFirst)
    {
        monthSelect.options[0] = new Option(4);
        for(var i = 6; i <= 12; i++)
            monthSelect.options[i-5] = new Option(i);
    } 
    else if (yearSelect.value == yearLast)
    {
        for(var i = 1; i <= monthLast; i++)
            monthSelect.options[i-1] = new Option(i);
    }
    else
    {
        for(var i = 1; i <= 12; i++)
            monthSelect.options[i-1] = new Option(i);
    }

    for(var i = 0; i < monthSelect.options.length; i++)
    {
        if(monthSelect.options[i].value == defaultMonth)
        {
            monthSelect.selectedIndex = i;
            return;
        }

        if(Math.abs(monthSelect.options[i].value - defaultMonth) < Math.abs(monthSelect.value - defaultMonth))
            monthSelect.selectedIndex = i;
    }
}

function checkIsCorrectDate()
{
    var yearSelect = document.seasonForm.yearSelect;
    var monthSelect = document.seasonForm.monthSelect;

    if (yearSelect.value == yearFirst)
    {
        if (monthSelect.value == 4 || 6 <= monthSelect.value && monthSelect.value <= 12)
            return true;
    } 
    else if (yearSelect.value == yearLast)
    {
        if (1 <= monthSelect.value && monthSelect.value <= monthLast)
            return true;
    }
    else if(yearFirst <= yearSelect.value&&yearSelect.value <= yearLast)
    {
        if (1 <= monthSelect.value && monthSelect.value <= 12)
            return true;
    }   

    return false;
}
