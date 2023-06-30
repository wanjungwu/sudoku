
//畫面上的題目
let activeSudoku = [];

//DOM填入數字
function renderSudoku(){
    activeSudoku = createSudoku();
    let el = document.querySelector("#table")
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
    for(let i = 0; i < 9; i++){
        let domTr = document.createElement("tr")
        for(let j = 0; j < 9; j++){
            let domTd = document.createElement("td")
            domTd.setAttribute('data-index', `${i}${j}`)
            if(activeSudoku[i][j] !== '.'){
                domTd.textContent = activeSudoku[i][j] !== '.' ? activeSudoku[i][j] : '';
                domTd.classList.add('init');
            }
        
            domTr.appendChild(domTd)
        }
        el.appendChild(domTr)
    }
}
renderSudoku();


//答案按鈕
const answerBtn = document.getElementById('answerBtn')
answerBtn.addEventListener('click', () => {
    const completeBoard = solveSudoku(activeSudoku)
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let domTd = document.querySelector(`td[data-index="${i}${j}"]`)
            domTd.textContent = completeBoard[i][j];
        }
    }
})

//題目按鈕
const questionBtn = document.getElementById('questionBtn')
questionBtn.addEventListener('click', renderSudoku)

//數獨解法
function solveSudoku(board){

    //!先解析：每一個row(列)/每一個column(欄)/每一個Matrix(九宮格)的數字使用狀況
    const copyBoard = JSON.parse(JSON.stringify(board))
    let rowUseNumber = new Array(9).fill(0).map(()=>new Array(9).fill(false));
    let columnUseNumber = new Array(9).fill(0).map(()=>new Array(9).fill(false));
    let matrixUseNumber = new Array(9).fill(0).map(()=>new Array(9).fill(false));
    for( let i = 0; i < 9; i++){
        for( let j = 0; j < 9; j++){
            let num = copyBoard[i][j];
            if( num !== '.') {
                rowUseNumber[i][num-1] = true;
                columnUseNumber[j][num-1] = true
                matrixUseNumber[Math.floor(j/3)+Math.floor(i/3)*3][num-1]=true;
            }
        }
    }

    //!遞迴函式：在函式內呼叫自己？會發生什麼事呢？
    function recursion(row,col){
        if(col === 9) {
            col = 0;
            row++;
            if( row === 9)return true;
        };
        if(copyBoard[row][col] === '.'){
            for(let i = 0; i < 9; i++){
                // console.log(`[${row+1}][${col+1}]`,i+1) 
                if(!rowUseNumber[row][i] && !columnUseNumber[col][i] 
                    && !matrixUseNumber[Math.floor(col/3)+Math.floor(row/3)*3][i]){
                    // console.log(`[${row+1}][${col+1}]`, 'ok', i+1)
                    rowUseNumber[row][i] = true;
                    columnUseNumber[col][i] = true;
                    matrixUseNumber[Math.floor(col/3)+Math.floor(row/3)*3][i] = true;
                    copyBoard[row][col] = (i+1).toString();
                    if(recursion(row,col + 1))return true;
                    // console.log(`[${row+1}][${col+1}]`, 'not ok', i+1)
                    rowUseNumber[row][i] = false;
                    columnUseNumber[col][i] = false;
                    matrixUseNumber[Math.floor(col/3)+Math.floor(row/3)*3][i] = false;
                    copyBoard[row][col] = '.'
                }
            }
            return false;
        }else return recursion(row, col + 1)
    }
    recursion(0,0)
    return copyBoard
}

//產生題目
function createSudoku(){

    //!先產生一個空的二維陣列
    let  initBox = new Array(9).fill('.').map(()=>new Array(9).fill('.'));

    //!在對角線上的三個九宮格先隨機填入數字
    setRandomNum(0,0)
    setRandomNum(3,3)
    setRandomNum(6,6)
    function setRandomNum(i, j){
        let result = [];
        let index = 0;
        const indexArr = getIndexArr(i, j);
        while (result.length < 9){
            temp = randomNum(1, 9);
            if(result.indexOf(temp) === -1){
                result.push(temp);
                initBox[indexArr[index][0]][indexArr[index][1]] = `${temp}`;
                index ++;
            }
        }
    }
    function getIndexArr(i, j){
        let start = Number(`${i}${j}`)
        let arr = [];
        for(let n = 0; n < 3; n++){
            if(start+n < 10) arr = arr.concat([`0${start+n}`, `${start+n+10}`, `${start+n+20}`])
            else arr = arr.concat([`${start+n}`, `${start+n+10}`, `${start+n+20}`])
        }
        return arr
    }
    function randomNum(min, max){
        return Math.floor(Math.random()* (max-min+1))+min
    }

    //!解答這個題目
    const completeBoard = solveSudoku(initBox)

    //!最後隨機挖掉數字，產生題目
    function removeRandomNumber(board){
        let copyBoard = JSON.parse(JSON.stringify(solveSudoku(board)))
        let result = [];
        let index = 0;
        while (result.length < 45){
            const tem1 = randomNum(0, 8);
            const tem2 = randomNum(0, 8);
            const removeIndex = `${tem1}${tem2}`; 
            if(result.indexOf(removeIndex) === -1){
                result.push(removeIndex);
                copyBoard[tem1][tem2] = `.`;
                index ++;
            }
        }
        return copyBoard
    }
    return removeRandomNumber(completeBoard)

}

