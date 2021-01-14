const time = 15;

const game = {
    timer: time,
    question: "",
    score: 0,
    answer: "",
    buttonChosen: "",
    highScore: 0,
}

let operator = []
let firstNumber = []
let secondNumber = []
let set = []

const createSet = () => {
    for (let i = 0; i < operator.length; i++) {
        if (operator[i] == "+") {
            const additionObj = {}
            additionObj["operator"] = operator[i]
            if (firstNumber.includes("additionFirstSingle")) {
                additionObj["first"] = "single"
            }
            if (firstNumber.includes("additionFirstDouble")) {
                additionObj["first"] = "double"
            }
            if (secondNumber.includes("additionSecondSingle")) {
                additionObj["second"] = "single"
            }
            if (secondNumber.includes("additionSecondDouble")) {
                additionObj["second"] = "double"
            }
            set.push(additionObj)
        } else if (operator[i] == "-") {
            let subsObj = {}
            subsObj["operator"] = operator[i]
            if (firstNumber.includes("subsFirstSingle")) {
                subsObj["first"] = "single"
            }
            if (firstNumber.includes("subsFirstDouble")) {
                subsObj["first"] = "double"
            }
            if (secondNumber.includes("subsSecondSingle")) {
                subsObj["second"] = "single"
            }
            if (secondNumber.includes("subsSecondDouble")) {
                subsObj["second"] = "double"
            }
            set.push(subsObj)
        } else if (operator[i] == "*") {
            let mulObj = {}
            mulObj["operator"] = operator[i]
            if (firstNumber.includes("mulFirstSingle")) {
                mulObj["first"] = "single"
            }
            if (firstNumber.includes("mulFirstDouble")) {
                mulObj["first"] = "double"
            }
            if (secondNumber.includes("mulSecondSingle")) {
                mulObj["second"] = "single"
            }
            if (secondNumber.includes("mulSecondDouble")) {
                mulObj["second"] = "double"
            }
            set.push(mulObj)
        } else {
            set.push({ operator: "/", first: "double", second: "single" })
        }
    }
}

const newQuestion = () => {

    shuffleArray(set)
    const generateRandNbr = (type) => {
        if (type == "single") {
            return Math.floor(Math.random() * 9) + 1
        } else {
            return Math.floor(Math.random() * 90) + 10
        }
    }

    //getting the questions
    let questionOperator = set[0].operator;
    let questionFirst = generateRandNbr(set[0].first);
    const questionSecond = generateRandNbr(set[0].second);

    if (questionOperator == "/") {
        const third = questionFirst * questionSecond;
        questionFirst = third;
    }

    if (questionOperator == "+") {
        game.answer = questionFirst + questionSecond;
    } else if (questionOperator == "-") {
        game.answer = questionFirst - questionSecond;
    } else if (questionOperator == "*") {
        game.answer = questionFirst * questionSecond;
    } else {
        game.answer = questionFirst / questionSecond;
    }

    if (questionOperator == "/") {
        questionOperator = "÷"
    }
    if (questionOperator == "*") {
        questionOperator = "x"
    }
    game.question = questionFirst + " " +  questionOperator + " " + questionSecond
    $(".message").text("Click on the correct answer!").css("color","grey")
    $("#question").text(game.question)
    
    generateRandomOptions()
}

const generateRandomOptions = () => {
    const ans = game.answer
    //push randomized options to the multiple choices
    const setOfDiff = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    shuffleArray(setOfDiff)
    const randomOptions = [ans - setOfDiff.pop(), ans + 10, ans - setOfDiff.pop(), ans]
    shuffleArray(randomOptions)
    for (let i = 0; i < 4; i++) {
        $(".optionButton").eq(i).text(randomOptions[i])
    }
    waitingForAns()
}

const waitingForAns = () => {
    $(".optionButton").unbind().on("click", (event) => {
        game.buttonChosen = $(event.target).text();
        checkAnswer();
    })
}

const wrongAns = () => {
    setTimeout(() => {
        $(".optionButton").addClass("nudge");
        setTimeout(() => {
            $(".optionButton").removeClass("nudge");
        }, 400);
      }, 100);
}

const checkAnswer = () => {
    if (game.answer === parseInt(game.buttonChosen, 10)) {
        game.score += 10
        $("#score").text(game.score)
        game.timer += 2
        $("#timer").text(game.timer)
        newQuestion()
        
    } else {
        if ((game.score - 5) < 0) {
            game.score = 0
        } else {
            game.score -= 5
        }
        $("#score").text(game.score)
        if ((game.timer - 1) < 1) {
            gameOver()
        } else {
            game.timer -=1
        }
        $("#timer").text(game.timer)
        wrongAns()
        waitingForAns()
    }

}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const timerCountdown = () => {
    const countDown = setInterval( () => {
        $("#timer").text(game.timer);
        if(game.timer===0){
            clearInterval(countDown)
            gameOver()
        }
        else {
            game.timer--
        }
    }, 1000);
}

const gameOver = () => {
    $(".gamePage").hide();
    $(".gameOver").show();
    if (game.score > game.highScore) {
        game.highScore = game.score;
    }
    $("#scoreResult").text(game.score)
    $("#highscore").text(game.highScore)

    $("#playAgain").unbind().on("click", () => {
        $(".gameOver").hide();
        game.timer = time;
        game.score = 0;
        $(".message").text("Click on the correct answer")
        $("#timer").text(game.timer)
        $("#score").text(game.score)
        $(".gamePage").show()
        timerCountdown();
        newQuestion();
    })

    $("#quit").unbind().on("click", () => {
        // const disableDropdown = () => {
        //     $("select").prop("disabled",true); 
        //     for (let i=0;i<6;i++){
        //         $(".dropdown")[i].selectedIndex = 0;
        //     }
        // }
        // $(".gameOver").hide();
        // $(".welcomePage").show();
        // game.score = 0; game.highScore = 0; game.timer = time;
        // operator = []; firstNumber = []; secondNumber = []; set = [];
        // $("#timer").text(game.timer);  
        // $("input:checkbox[name=arithmetic]:checked").prop("checked",false);
        // disableDropdown();
        location.reload()         
    })
}

const checkSelection = () => {
    //push checked-box value to operator array
    $("input:checkbox[name=arithmetic]:checked").each(function () {
        operator.push($(this).val());
    })

    const welcomePageReset = () => {
        operator = []
        firstNumber = []
        secondNumber = []
        set = []
    }

    const allValidationOk = () => {
        $(".welcomePage").hide();
        $(".gamePage").show();
        game.timer = time;
        timerCountdown();
        createSet();
        newQuestion();
    }

    //check if there is any value pushed. if yes, validate selection is done and push the selected options to an array.Else, prompt player to select
    if (operator.length == 0) {
        alert("Pls choose at least one option before you start")
    } else {
        $.each($(".first option:selected"), function () {
            if ($(this).val() != "") {
                firstNumber.push($(this).val());
            }
        })

        $.each($(".second option:selected"), function () {
            if ($(this).val() != "") {
                secondNumber.push($(this).val());
            }
        })

        const obj = {
            "+": ["#additionFirst", "#additionSecond"],
            "-": ["#subsFirst", "#subsSecond"],
            "*": ["#mulFirst", "#mulSecond"]
        }
        
        let i =0;
        while (i < operator.length) {
            if (operator[i] == "/") {
                if (i === operator.length - 1) {
                    i = operator.length;
                    allValidationOk()
                }
                else {
                    i += 1
                }
            } else {
                
                if ($(obj[operator[i]][0]).val() == null || $(obj[operator[i]][1]).val() == null) {
                    alert("pls select from the dropdown list")
                    welcomePageReset();
                    i = operator.length;
                } else {
                    if (i === operator.length - 1) {
                        i = operator.length;
                        allValidationOk()
                    } else {
                        i += 1
                    }
                }
            }
        }
    }
}

$(() => {
    $(".gamePage").hide();
    $(".gameOver").hide()

    //To enable/disabled dropdown list
    const obj = {
        "addition": ["#additionFirst", "#additionSecond"],
        "substraction": ["#subsFirst", "#subsSecond"],
        "multiplication": ["#mulFirst", "#mulSecond"]
    }

    $(".checkbox").on("change", (event) => {
        const targetID = event.target.id
        const checkedID = "."+ targetID;
        if($(event.target).is(":checked")){
            $(checkedID).prop("disabled",false)
        } else {
            $(checkedID).prop("disabled",true);
            $(obj[targetID][0])[0].selectedIndex = 0;
            $(obj[targetID][1])[0].selectedIndex = 0;
        }
    })

    $("#startButton").unbind().on("click", checkSelection)

})