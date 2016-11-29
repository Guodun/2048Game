var board = new Array();//保存格子数组
var score =  0;// 得分
var hasConflicted = new Array();

//手机坐标
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {

    pregareForMobile();//移动端
    newgame();
});

function pregareForMobile() {

    //判断屏幕是否是大屏幕
    if( documenWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    $("#grid-container").css("width", gridContainerWidth - 2*cellSpace);
    $("#grid-container").css("height", gridContainerWidth - 2*cellSpace);
    $("#grid-container").css("padding", cellSpace);
    $("#grid-container").css("border-radius", 0.02 * gridContainerWidth);

    $(".grid-cell").css("width", cellSideLength);
    $(".grid-cell").css("height", cellSideLength);
    $(".grid-cell").css("border-radius", 0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机格子中生成数字
    generateOneNumber();
    generateOneNumber();
}

//给每个棋盘格定位
function init() {
    for( var i = 0; i < 4; i++){
        for( var j =0; j < 4; j++){
            var gridCell = $("#grid-cell" + "-" + i + "-" + j)
            gridCell.css("top", getPosTop( i , j ));//获取水平位置
            gridCell.css("left", getPosLeft( i , j ));//获取垂直位置
        }
    }

    for( var i = 0; i < 4; i ++ ){//创建二维数组
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0; j < 4; j ++ ){
            board[i][j] = 0;//初始化数组
            hasConflicted[i][j] = false;

        }
    }

    updataBoardView();
    score = 0 ;
    updataScore( score );
}


//刷新棋盘格
function updataBoardView() {

   $(".number-cell").remove();//如果有这个元素，删除元素
    for( var i = 0; i < 4; i ++ ){
        for( var j =0; j < 4; j ++){
            //添加数字格子
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theBumberCell = $("#number-cell-" +i + '-' +j);

            if( board[i][j] == 0){
                theBumberCell.css("width", "0px");
                theBumberCell.css("height", "0px");
                theBumberCell.css("top", getPosTop(i,j) + cellSideLength/2);
                theBumberCell.css("left", getPosLeft(i,j) + cellSideLength/2);
            } else{
                theBumberCell.css("width", cellSideLength);
                theBumberCell.css("height", cellSideLength);
                theBumberCell.css("top", getPosTop(i,j));
                theBumberCell.css("left", getPosLeft(i,j));
                theBumberCell.css("background-color", getNumberBackgroundColor( board[i][j]) );
                theBumberCell.css("color", getNumberColor( board[i][j]) );
                theBumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] = false; //归位，重新设置为false
        }
    }

    $(".number-cell").css("line-height", cellSideLength+"px");
    $(".number-cell").css("font-size", 0.6*cellSideLength+"px");
}

function generateOneNumber() {

    if( nospace( board) ){//判断格子是否有位置生成数字
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    //判断格子是否可用
    // while( true ){
    //     if( board[randx][randy] == 0 ){
    //         break;
    //     }
    //     randx = parseInt(Math.floor(Math.random() * 4));
    //     randy = parseInt(Math.floor(Math.random() * 4));
    // }

    //优化上面的算法
    var times = 0;

    while( times < 50 ){
        if( board[randx][randy] == 0){
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times ++;
    }
    if ( times === 50 ){
        for( var i = 0; i < 4; i++ ){
            for( var j = 0; j < 4; j++ ){
                if( board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    //50%几率随机一个2或者4的数字
    var randNumber = Math.random() < 0.5 ?  2 : 4;

    //正随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx, randy, randNumber );

    return true;
}

//上下左右键盘控制
$(document).keydown( function (event) {

    switch( event.keyCode ){
        case 37: //left
            event.preventDefault();//阻挡事件发生时的默认效果，避免小屏幕按上下键同时滑动滚动条
           if( moveLeft() ){
               setTimeout("generateOneNumber()", 200);
               setTimeout("isGameover()", 300);
           }
            break;
        case 38: //up
            event.preventDefault();
            if( moveUp() ){
                setTimeout("generateOneNumber()", 200);
                setTimeout("isGameover()", 300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if( moveRight() ){
                setTimeout("generateOneNumber()", 200);
                setTimeout("isGameover()", 300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if( moveDown() ){
                setTimeout("generateOneNumber()", 200);
                setTimeout("isGameover()", 300);
            }
            break;
        default: //default
            break;
    }
});


//安卓4.0， e.preventDefault如果没有正确使用的话，无法触发touchstart和touchmove
//预防安卓bug
document.addEventListener("touchmove", function (event) {
    event.preventDefault();
});


//点击触屏开始事件
document.addEventListener("touchstart", function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

//点击触屏结束事件
document.addEventListener("touchend", function (event) {
    console.log(event.changedTouches[0].pageX);
    console.log(event.changedTouches[0].pageY);
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    //当滑动的距离小于宽度的0.3倍，判断用户没有滑动
    if( Math.abs( deltax ) < 0.3*documenWidth && Math.abs( deltay ) < 0.3*documenWidth ){
        return;
    }

    //滑动X方向
    if(Math.abs(deltax) >= Math.abs(deltay)){

        if( deltax > 0 ){
            //move right
            if( moveRight() ){
                setTimeout("generateOneNumber()", 200);
                setTimeout("isGameover()", 300);
            }
        }
        else{
            //move left
            if( moveLeft() ){
                setTimeout("generateOneNumber()", 200);
                setTimeout("isGameover()", 300);
            }
        }

    }
    //滑动Y方向
    else{

        if( deltay > 0 ){
            //move down
            if( moveDown() ){
                setTimeout("generateOneNumber()", 200);
                setTimeout("isGameover()", 300);
            }
        }
        else{
            //move up
            if( moveUp() ){
                setTimeout("generateOneNumber()", 200);
                setTimeout("isGameover()", 300);
            }
        }
    }
});

//判断游戏结束
function isGameover() {
    if ( nospace( board ) && nomove( board ) ){ //没有空格以及格子无法相加
        gameover();
    }

}

//游戏结束
function gameover() {
    alert("GameOver!")
}

//向左移动
function moveLeft() {

    if( !canMoveleft( board ) ){
        return false;
    }

    //moveLeft
    for( var i = 0; i < 4; i++ ){
        for( var j = 1; j < 4; j++ ){
            if ( board[i][j] != 0 ){ //遍历可移动的格子

                for( var k = 0; k < j; k++ ){ //遍历当前元素所有左侧的元素
                    if( board[i][k] == 0 && noBlockHorizontal( i, k, j, board ) ){//判断移动点，且没有阻碍
                        //move
                        showMoveAnimation( i, j, i, k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0
                        continue;
                    }
                    else if( board[i][k] == board[i][j] &&
                        noBlockHorizontal( i, k, j, board ) &&
                        !hasConflicted[i][k] ){//数字相等，且没有障碍,且一个格子只能碰撞一次
                        //move
                        showMoveAnimation( i, j, i, k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updataScore( score );
                        //hasConflicted[i][k] = true;
                        continue;
                    }

                }
            }
        }
    }

    setTimeout("updataBoardView()", 200);//刷新
    return true;
}


//向右移动
function moveRight() {
     if( !canMoveRight(board) ){
         return false;
     }
     //moveright
    for( var i = 0; i < 4; i++ ){
         for( var j = 2; j >= 0; j--){
             if( board[i][j] != 0 ){

                 for( var k = 3; k > j; k--){
                     if( board[i][k] == 0 &&  noBlockHorizontal( i, k, j, board ) ){
                         //move
                         showMoveAnimation( i, j, i, k );
                         board[i][k] = board[i][j];
                         board[i][j] = 0;
                         continue;
                     }
                     else if( board[i][k] == board[i][j] &&
                         noBlockHorizontal( i, j, k, board ) &&
                         !hasConflicted[i][k] ){
                         //move
                         showMoveAnimation( i, j, i, k );
                         //add
                         board[i][k] += board[i][j];
                         board[i][j] = 0;
                         //add score
                         score += board[i][k];
                         updataScore( score );
                         hasConflicted[i][k] = true;
                         continue;
                     }
                 }
             }
         }
    }

    setTimeout("updataBoardView()", 200);//刷新
    return true;

}

//向下移动
function moveDown() {

    if( !canMoveDown( board ) ){
        return false;
    }
    //moveDown

    for ( var j = 0; j < 4; j++ ){
        for( var i = 2; i >= 0; i-- ){
            if(board[i][j] != 0){

                for( var k = 3; k > i; k--){
                    if( board[k][j] == 0 && noBlockVertical( j, k, i, board ) ){
                        //move
                        showMoveAnimation( i, j, k, j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updataScore( score );
                        continue;
                    }
                    else if( board[k][j] == board[i][j] &&
                        noBlockVertical( j, i, k, board ) &&
                        !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation( i, j, k, j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updataScore( score );
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updataBoardView()", 200);//刷新
    return true;
}


//向上移动
function moveUp() {

    if( !canMoveUp( board ) ){
        return false;
    }

    //moveUp
    for( var j = 0; j < 4; j++ ){
        for( var i = 1; i < 4; i++){
            if( board[i][j] != 0 ){

                for( var k = 0; k < i; k++){
                    if( board[k][j] ==0 && noBlockVertical( j, k, i, board ) ){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] &&
                        noBlockVertical( j, k, i, board ) &&
                        !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updataScore( score );
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updataBoardView()", 200);//刷新
    return true;

}