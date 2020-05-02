const rules = ["splat_zones","tower_control","rainmaker","clam_blitz"];
const rulesJP = ["ガチエリア","ガチヤグラ","ガチホコ","ガチアサリ"];
var checkedWeapon;
var rankingData = new Array();

function generateButtonClicked()
{
    checkedWeapon = new Array();

    for (var i = 0; i < 139; i++)
    {
        if(document.getElementById("cb"+i).checked)
            checkedWeapon.push(i);
    }

    if(checkedWeapon.length==0) return;

    var year = document.seasonForm.yearSelect.value.substr(2,2);
    var month = ('00'+document.seasonForm.monthSelect.value).slice(-2);
    
    for (var i = 0; i < rules.length; i++)
        getJsonDataFromPath("assets/json/"+year+month+rules[i],i);

    var noDisplays = Array.from(document.getElementsByClassName('noDisplay'));
    noDisplays.forEach(element => 
    {
        element.style.display = 'block';
    });

    var canvas = document.getElementById('canvas');
    var base64 = canvas.toDataURL("image/png");
    var img = new Image;
    img.onload = changeLightBoxUri;
    img.src = base64;
}

function downloadButtonClicked()
{
    var canvas = document.getElementById('canvas');
    var base64 = canvas.toDataURL("image/png") ;
    document.getElementById("download").download = document.titleForm.titleInput.value + "ランキング.png";
    document.getElementById("download").href = base64;
}

function getJsonDataFromPath(path,index)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() 
    {
        if(req.readyState == 4 && req.status == 200)
        {
            rankingData[index] = JSON.parse(req.responseText);
            if(index == 3) 
                drawCanvasFromData();
        }
    };
    req.open("GET", path, false);
    req.send(null);
}

// jsonロード → 背景画像ロード → 背景出力 → 画像ロード → 画像出力 → 文字ロード → 文字出力
function drawCanvasFromData()
{
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var title = document.titleForm.titleInput.value;
    var year = document.seasonForm.yearSelect.value;
    var month = document.seasonForm.monthSelect.value;
    var ranking = getMatchedRankingData();

    var startY = 250;
    var interval = 50;

    canvas.width = 2340;
    canvas.height = startY + interval * (Math.max(ranking[0].length,ranking[1].length,ranking[2].length,ranking[3].length));

    // bg
    ctx.fillStyle = '#777777';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // title
    ctx.fillStyle = '#000000';
    ctx.textAlign = "center";
    ctx.font = '50pt Arial';
    ctx.fillText(title+" ランキング", canvas.width/2,50);

    // subtitle
    ctx.font = '30pt Arial';
    ctx.fillText(year+" / "+month, canvas.width/2,100);

    // rule
    ctx.font = '30pt Arial';
    for (var i = 0; i < rules.length; i++)
        ctx.fillText(rulesJP[i],canvas.width*(i*2+1)/8,200);

    // data
    ctx.textAlign = "left";
    ctx.font = '20pt Arial';

    for(var i = 0; i < ranking.length; i++)
    {
        for(var j = 0; j < ranking[i].length; j++)
        {
            ctx.fillText(ranking[i][j].rank, canvas.width * (i * 2) / 8  + 55,startY + interval * j);
            ctx.fillText(ranking[i][j].rank_change=="up"?"↑":ranking[i][j].rank_change=="down"?"↓":"→",canvas.width * (i * 2) / 8  + 100,startY + interval * j);
            ctx.fillText(ranking[i][j].weapon, canvas.width * (i * 2) / 8  + 140,startY + interval * j - 10);
            ctx.fillText(ranking[i][j].name, canvas.width * (i * 2) / 8  + 190,startY + interval * j);
            ctx.fillText(ranking[i][j].x_power.toFixed(1), canvas.width * ((i + 1) * 2) / 8  - 128,startY + interval * j + 2);
        }
    }
}

function getMatchedRankingData()
{
    var result = new Array();
    for(var i = 0; i < rules.length; i++)
    {
        result[i] = new Array();

        rankingData[i].forEach(element => 
        {
            if(checkedWeapon.indexOf(element.weapon)!=-1) 
                result[i].push(element);
        });
    }

    return result;
}

function imageToDataUri(img, width, height) 
{
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/png');
}

function changeLightBoxUri() 
{
    var canvas = document.getElementById('canvas');
    
    var width = window.innerWidth - 100;
    var newDataUri = imageToDataUri(this, width, canvas.height * width / canvas.width);

    document.getElementById("canvasLightBox").href = newDataUri;
    document.getElementById("canvasLightBox").title = document.titleForm.titleInput.value+" ランキング";
}