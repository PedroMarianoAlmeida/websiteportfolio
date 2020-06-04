var timeLeft = 10;
var currentScore = 0;
var highScore = 0;
var firstRound = true;
let maxNumber = 10;

let createOperating = function() {
    let operateOptions = [];
    if( $('#sum-operator').is(":checked") ){
        operateOptions.push('+');
    }
    if( $('#sub-operator').is(":checked") ){
        operateOptions.push('-');
    }
    if( $('#mul-operator').is(':checked') ){
        operateOptions.push('*');
    }
    if( $('#div-operator').is(':checked') ){
        operateOptions.push('/');
    }
    let randomOperator = function(){
        if(operateOptions.length === 1) {
            return operateOptions[0];
        }
        else{
            let position = Math.floor( Math.random() * operateOptions.length);
            return(operateOptions[position]);
        }
    }

    let rangeRandom = function (min, max) {
        let randomNumber = ( Math.random() * (max- min) ) + min;
        return Math.round (randomNumber);
    }
    
    let operator = randomOperator();
    let number1 = rangeRandom(0, maxNumber);
    let number2 = function() {
        if(operator === '/') { //Have to garantee the operation number1/number2 is a integer number
            let possibleNumbers = [1]; //Any number is divisible for 1
            for(let i = 2 ; i <= maxNumber; i++) {
                if(number1 % i === 0 ) possibleNumbers.push(i);
            }
            let position = rangeRandom(0 , possibleNumbers.length - 1);
            return possibleNumbers[position];
        }
        if(operator === '-'){
            return rangeRandom(0, number1) //This is for number2 never be higher than number1 in a subtraction, causing a negative number 
        }
        return rangeRandom(0, maxNumber);
    }

    let operation = `${String(number1)} ${operator} ${String(number2())}`;
    let result = Math.floor( eval(operation) );
    return( [operation , result]);
}

var currentOperation;
let setQuestion = function(){
    currentOperation = createOperating();
    $('#operation').text(currentOperation[0]);
}

let showTimeLeft = function (){
    $('#counting-down').text(timeLeft);
}

let endGame = function() {
    $('#game-over').show();
    $('#user-answer').attr('readonly', true);
}

let countingDown = function() {
    let timer = setInterval( function(){
        timeLeft--;
        if(timeLeft >= 0) {
            showTimeLeft();
        }
        else{
            clearInterval(timer);
            endGame();
        }        
        
    } , 1000);
}

let updateScoreAndHighScore = function() {
    $('#current-score').text(currentScore);
    if(currentScore > highScore){
        highScore = currentScore;
        $('#high-score').text(highScore);
    }
}

let startGame = function(){
    if(firstRound){
        firstRound = false;
        countingDown();
    }  
}

let checkUserAnswer = function() {    
    let userAnswer = $('#user-answer').val();
    //console.log(userAnswer);
    if( Number(userAnswer) === Number(currentOperation[1]) ) {
        //console.log('correct answer');
        currentScore++;
        updateScoreAndHighScore();
        $('#user-answer').val('');
        timeLeft++;
        showTimeLeft();
        setQuestion();
    }
    else {
        //console.log('Wrong answer');
        $('#user-answer').val('');
    }
}

let reestartGame = function() {
    $('#game-over').hide();
    firstRound = true;
    timeLeft = 10;
    showTimeLeft();
    currentScore = 0;
    updateScoreAndHighScore();
    $('#user-answer').removeAttr('readonly');
}

let changeMaxValue = function() {
    let maxNumberChanged = $('#number-limit-control').val();
    $('#number-limit-exhibt').text(maxNumberChanged);
    maxNumber = maxNumberChanged;
}

let firstLoad = function() {
    $('#game-over').hide();
    setQuestion();
    $('#number-limit-exhibt').text(maxNumber);
    $('#number-limit-control').val(maxNumber);
}

$(document).ready( function(){
    firstLoad();
    $(document).on('keydown' , '#user-answer', startGame);
    $(document).on('change' , '#user-answer', checkUserAnswer);
    $(document).on('click' , '#btn-try-again' , reestartGame);
    $(document).on('change' , '#number-limit-control' , changeMaxValue);
});
