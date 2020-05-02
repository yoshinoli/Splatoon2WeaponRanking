var yearFirst = 2018;
var yearLast = 2020;
var monthLast = 4;

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

// yearを入れ替えた時にmonthが1になってしまう → monthを元の値準拠にしたい
// 年と月を変な奴ポストしてもいいように例外処理したほうがいい?
function changeMonthSelecter()
{
    var yearSelect = document.seasonForm.yearSelect;
    var monthSelect = document.seasonForm.monthSelect;
    monthSelect.options.length = 0;
         
    if (yearSelect.options[yearSelect.selectedIndex].value == yearFirst)
    {
        monthSelect.options[0] = new Option(4);
        for(var i = 6; i <= 12; i++)
            monthSelect.options[i-5] = new Option(i);
    } 
    else if (yearSelect.options[yearSelect.selectedIndex].value == yearLast)
    {
        for(var i = 1; i <= monthLast; i++)
            monthSelect.options[i-1] = new Option(i);
    }
    else
    {
        for(var i = 1; i <= 12; i++)
            monthSelect.options[i-1] = new Option(i);
    }   
}