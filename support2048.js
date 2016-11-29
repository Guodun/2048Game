documenWidth = window.screen.availWidth;  //屏幕宽度
gridContainerWidth = 0.92 * documenWidth; //棋盘宽度
cellSideLength = 0.18 * documenWidth; //棋盘格宽度
cellSpace = 0.04 * documenWidth; //棋盘格间距

//竖轴位置
function getPosTop( i , j ) {
    return cellSpace + i*(cellSpace+cellSideLength);
}

//横轴位置
function getPosLeft( i , j) {
    return cellSpace + j*(cellSpace+cellSideLength);
}

function getNumberBackgroundColor( number ) {
    switch( number ){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }

    return "black";
}

function getNumberColor( number ) {
    if( number <= 4 ){
        return "#776e65"
    }

    return "white";
}

function nospace( board ) {
    for( var i = 0; i < 4; i++){
        for( var j = 0; j < 4; j++){
            if( board[i][j] == 0 ){
                return false;
            }
        }
    }
    return true;
}


//判断当前元素是否可以向左移动
function canMoveleft( board ) {
    for( var i = 0; i < 4; i++ ){
        for( var j = 1; j < 4; j++){ //j==1时，不会遍历第一列
            if( board[i][j] != 0 ){ //当前元素不为0
                if( board[i][j-1] == 0 || board[i][j] === board[i][j-1] ){ //当前元素的左侧为0，或等于左边的元素
                    return true;
                }
            }
        }
    }
    return false;
}

//判断当前元素是否可以向上移动
function canMoveUp( board ) {

    for( var j = 0; j < 4; j++ ){
        for( var i = 1; i < 4; i++){
            if( board[i][j] != 0 ){
                if( board[i-1][j] == 0 || board[i][j] === board[i-1][j] ){ //当前元素的上侧为0，或等于左边的元素
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight( board ) {

    for( var i = 0; i < 4; i++){
        for( var j = 2; j >= 0; j--){
            if( board[i][j] != 0){
                if(board[i][j+1] == 0 || board[i][j] == board[i][j+1]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown( board ) {
    for( var j = 0; j < 4; j++ ){
        for( var i = 2; i >= 0; i-- ){
            if( board[i][j] !=0){
                if( board[i+1][j] == 0 || board[i+1][j] === board[i][j] ){
                    return true;
                }
            }
        }
    }
    return false;
}

//判断是否是障碍物
function noBlockHorizontal( row, col1, col2, board) {

    for( var i = col1 + 1; i < col2; i++){
        if( board[row][i] != 0 ){

            return false;
        }
    }
    return true;
}
function noBlockVertical( col, row1, row2, board) {
    for( var i = row1 + 1; i < row2; i++){
        if( board[i][col] != 0 ){
            return false;
        }
    }
    return true;
}

function nomove( board ) {
    if( canMoveDown( board ) ||
        canMoveleft( board ) ||
        canMoveRight( board ) ||
        canMoveUp( board ) ){
        return false;
    }

    return true;
}

