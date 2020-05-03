const rules = ["splat_zones","tower_control","rainmaker","clam_blitz"];
const rulesJP = ["ガチエリア","ガチヤグラ","ガチホコ","ガチアサリ"];
var checkedWeapon;
var rankingData = new Array();

function generateButtonClicked()
{
    if (checkIsCorrectDate() == false)
        return;

    checkedWeapon = new Array();

    for (var i = 0; i < 139; i++)
    {
        if(document.getElementById("cb"+i).checked)
            checkedWeapon.push(i);
    }

    if(checkedWeapon.length==0) return;

    var year = document.seasonForm.yearSelect.value.substr(2,2);
    var month = ("00"+document.seasonForm.monthSelect.value).slice(-2);
    
    for (var i = 0; i < rules.length; i++)
        getJsonDataFromPath("assets/json/"+year+month+rules[i],i);

    var noDisplays = Array.from(document.getElementsByClassName("noDisplay"));
    noDisplays.forEach(element => 
    {
        element.style.display = "block";
    });
}

function downloadButtonClicked()
{
    var base64 = canvas.toDataURL("image/png") ;
    document.getElementById("download").download = document.titleForm.titleInput.value + "ランキング.png";
    document.getElementById("download").href = base64;
}

function imageToDataUri(img, width, height) 
{
    var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/png");
}

function changeLightBoxUri() 
{
    var canvas = document.getElementById("canvas");
    
    var width = window.innerWidth - 100;
    var newDataUri = imageToDataUri(this, width, canvas.height * width / canvas.width);

    document.getElementById("canvasLightBox").href = newDataUri;
    document.getElementById("canvasLightBox").title = document.titleForm.titleInput.value+" ランキング";
}

// jsonロード → 背景画像ロード → 背景出力 → 画像ロード → 画像出力 → 文字ロード → 文字出力
function getJsonDataFromPath(path,index)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() 
    {
        if(req.readyState == 4 && req.status == 200)
        {
            rankingData[index] = JSON.parse(req.responseText);
            if(index == 3) 
                initializeCanvas();
        }
    };
    req.open("GET", path, false);
    req.send(null);
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

const startY = 250;
const interval = 50;
var ranking;
var canvas;
var ctx;

function initializeCanvas()
{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ranking = getMatchedRankingData();

    canvas.width = 2340;
    canvas.height = startY + interval * (Math.max(ranking[0].length,ranking[1].length,ranking[2].length,ranking[3].length));
    drawBackgroundImageToCanvas();
}

function drawBackgroundImageToCanvas()
{
    //bg
    ctx.fillStyle = "#808080";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    var img = new Image;
    img.src = "assets/images/bg_squid2.png";
    img.onload = function()
    {
        const drawRotatedImage = (image, x, y, angle) => 
        {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle * Math.PI/180);
            ctx.drawImage(image, -(image.width/2), -(image.height/2));
            ctx.restore();
        }

        for (var i = 0; i < Math.ceil(canvas.width / 200); i++)
        {
            for (var j = 0; j < Math.ceil(canvas.height / 200); j++)
            {
                drawRotatedImage(img, i * 200 + 75, i % 2 == 0 ? j * 200 + 75 : j * 200 + 25, i%2==0 ? 0:180);
            }
        }

        drawImagesToCanvas();
    };
}

function drawImagesToCanvas()
{
    var topImg = new Image;
    topImg.src = "assets/images/top.png";
    topImg.onload = function()
    {
        var loadedElementsNumber = 0;
        checkedWeapon.forEach(element => 
        {
            var img = new Image;
            img.src = "assets/images/"+element+"C.png";
            img.onload = function()
            {
                for(var i = 0; i < ranking.length; i++)
                {
                    var isFirstTime = true;
                    for(var j = 0; j < ranking[i].length; j++)
                    {
                        if(ranking[i][j].weapon != element) continue;
                        if(isFirstTime) 
                        {
                            ctx.drawImage(topImg, canvas.width * (i * 2) / 8  + 10,startY + interval * j - 25);
                            isFirstTime = false;
                        }
                        ctx.drawImage(img, canvas.width * (i * 2) / 8  + 130,　startY + interval * j - 35,　50,　50);
                    }
                }

                loadedElementsNumber++;
                if(loadedElementsNumber == checkedWeapon.length)
                    drawStringDataToCanvasFromData();
            }
        });
    }
}

function drawStringDataToCanvasFromData()
{
    var title = document.titleForm.titleInput.value;
    var year = document.seasonForm.yearSelect.value;
    var month = document.seasonForm.monthSelect.value;

    // title
    ctx.fillStyle = "#FF7F50";
    ctx.textAlign = "center";
    ctx.font = "50pt NicoMoji";
    ctx.fillText(title+" ランキング", canvas.width/2,60);

    // subtitle
    ctx.font = "bold 30pt MPLUSRounded1c";
    ctx.fillText(year+" / "+month, canvas.width/2,110);

    // rule
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30pt NicoMoji";
    for (var i = 0; i < rules.length; i++)
        ctx.fillText(rulesJP[i],canvas.width*(i*2+1)/8,200);

    // data
    ctx.textAlign = "left";

    for(var i = 0; i < ranking.length; i++)
    {
        for(var j = 0; j < ranking[i].length; j++)
        {
            ctx.font = "20pt NicoMoji";
            ctx.fillStyle = "#ADFF2F";
            ctx.fillText(ranking[i][j].rank_change=="up"?"↑":ranking[i][j].rank_change=="down"?"↓":"→",canvas.width * (i * 2) / 8  + 105,startY + interval * j);
            ctx.fillStyle = "#000000";
            ctx.fillText(ranking[i][j].name, canvas.width * (i * 2) / 8  + 190,startY + interval * j);
            ctx.fillStyle = "#191817";
            ctx.beginPath();
            ctx.ellipse(canvas.width / 8 * ((i + 1) * 2) - 79, startY + interval * j - 8, 64, 23, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.font = "bold 20pt MPLUSRounded1c";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(ranking[i][j].x_power.toFixed(1), canvas.width * ((i + 1) * 2) / 8  - 128,startY + interval * j + 2);
            ctx.fillStyle = "#FF4500";
            ctx.fillText(ranking[i][j].rank, canvas.width * (i * 2) / 8  + 55,startY + interval * j);
        }
    }

    var base64 = canvas.toDataURL("image/png");
    var img = new Image;
    img.onload = changeLightBoxUri;
    img.src = base64;
}