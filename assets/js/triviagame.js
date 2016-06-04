(function() {

    // Variable declarations
    var currentQuizQuestion = 0;
    var missedQuizQuestion = 0;
    var secsElapsed = 0;
    var timeInterval = "";
    

    // Function declarations

    /////////////////////////////////////////////////////////////////////////////
    // Function to add answer choices from array JSON object
    /////////////////////////////////////////////////////////////////////////////
    function addTriviaChoices(choices) {

        // Check to ensure array is not undefined and is of type array
        if (typeof choices !== "undefined" && $.type(choices) === "array") {
            
            // Reinitialize the choice contents to blank
            $(".choice-one,.choice-two,.choice-three,.choice-four").text("");

            // From JSON object apply the choices
            var obj = { one: 0, two: 1, three: 2, four: 3 };

            $.each( obj, function( key, val ) {
                $( ".choice-" + key ).text(choices[val]);
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // Function to bind mouseover and mouseout events
    /////////////////////////////////////////////////////////////////////////////
    function setupPageButtons() {

        // Bind mouse over event
        $(".choice-style").on('mouseover', function () {
            $(this).css({
                 'background-color': '#66FF00'
            });
        });

        // Bind mouse out event
        $(".choice-style").on('mouseout', function () {
            $(this).css({
                 'background-color': '#fff'
            });
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // Function to process question
    /////////////////////////////////////////////////////////////////////////////
    function processTriviaQuestion() {

        // Increment counter for next question
        currentQuizQuestion++;
        
        // If counter is equal to total number of questions then display game over message 
        // else referesh page for next question
        if (currentQuizQuestion === quizQuestions.length) {
            endTrivia();
        } else {
            nextTriviaQuestion();
        }
    }

    /////////////////////////////////////////////////////////////////////////////
    // Function to process next question
    /////////////////////////////////////////////////////////////////////////////
    function nextTriviaQuestion() {
        
        // Initialize choices to blank
        $(".choice-one,.choice-two,.choice-three,.choice-four").css({
                 'background-color': '#fff'
             });
        
        // Bind events to choices
        setupPageButtons();

        // Assign question
        $('.trivia-question').text(quizQuestions[currentQuizQuestion]['question']);
        
        // Assign the number of the question being asked
        $('.no-of-questions').text('Question ' + Number(currentQuizQuestion + 1) + ' of ' + quizQuestions.length);
        
        // Assign choices
        addTriviaChoices(quizQuestions[currentQuizQuestion]['choices']);

        // Start timer of 20 sec to answer the question and update page with seconds elapsed
        timeInterval = setInterval(displaySecsElapsed, 1000);
    }

    /////////////////////////////////////////////////////////////////////////////
    // Function to start the trivia game for first time
    /////////////////////////////////////////////////////////////////////////////
    function startTrivia()   {

        nextTriviaQuestion();
    }

    /////////////////////////////////////////////////////////////////////////////
    // Function to process when game ended
    /////////////////////////////////////////////////////////////////////////////
    function endTrivia()    {

        // Show game ended modal window
        $("#gameover-message").modal('show');

        // Function to process when button is clicked in the model window
        $("#btn-game-close").on('click', function() {
            
            // Reinitialize variables/display
            currentQuizQuestion = 0;
            missedQuizQuestion = 0;
            secsElapsed = 0;
            timeInterval = "";
            $(".total-missed").text("Total questions not answered: " + missedQuizQuestion);

            // Start the game again
            startTrivia();
        });
    }

    /////////////////////////////////////////////////////////////////////////////
    // Function to process for every second while the user is waiting to 
    // answer
    /////////////////////////////////////////////////////////////////////////////
    function displaySecsElapsed()   {
        
        // Increment seconds elapsed
        secsElapsed++;

        // When seconds elapsed is 21 then stop timer and process next question
        // else display second elapsed on the page
        if (secsElapsed === 21) {
            clearInterval(timeInterval);
            processTriviaQuestion();
            secsElapsed = 0;
        } 
        else   {
            $(".time-left").text("Time Left: " + secsElapsed + " Seconds");
        }
    }

    // When user clicks one of the answer choices
    $(".choice-style").on('click', function () {
        
        // Stop the timer 
        clearInterval(timeInterval);

        // Reinitialize the elapsed timer
        secsElapsed = 0;

        // Get the value of the data-index attribute
        var choice = $(this).attr('data-index');

        // Unbind the events
        $(".choice-style").off('mouseout mouseover');

        // Check if the selected choice matches to correct answer
        if (quizQuestions[currentQuizQuestion]['choices'][choice] === quizQuestions[currentQuizQuestion]['correct']) {

            // If correct answer is selected change background color green
            $(this).css({
                'background-color': '#33CC00'
            });

        } else {

            // If correct answer is not selected change background color red
            $(this).css({
                'background-color': '#FF0000'
            });

            // Display the correct choice green
            var idxPosition =  quizQuestions[currentQuizQuestion]['choices'].indexOf(quizQuestions[currentQuizQuestion]['correct']);
            $("div[data-index='" + idxPosition + "']").css({
                'background-color': '#33CC00'
            });

            // Increment missed question
            missedQuizQuestion++;

            // Display on the page
            $(".total-missed").text("Total questions not answered: " + missedQuizQuestion);
        }
            
        // Wait for 3 seconds before refereshing next question
        setTimeout(processTriviaQuestion,3000);
    });

    // Display initial modal window
    $('#game-start-message').modal('show');

    // Start game when user clicks button on the model window
    $("#btn-game-open").on('click', startTrivia);
    
})();
