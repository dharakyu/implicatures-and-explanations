var botcaptcha = {
    name: 'botcaptcha',
    title: 'Are you a bot?',
    buttonText: 'Let\'s go!',
    render: function () {
      var viewTemplate = $('#botcaptcha-view').html();

      // define possible speaker and listener names
      // fun fact: 10 most popular names for boys and girls
      var speaker = _.shuffle(['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles'])[0];
      var listener = _.shuffle(['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Margaret'])[0];

      var story = speaker + ' says to ' + listener + ': \'It\'s a beautiful day, isn\'t it?\''

      $('#main').html(
        Mustache.render(viewTemplate, {
          name: this.name,
          title: this.title,
          text: story,
          question: 'Who is ' + speaker + ' talking to?',
          button: this.buttonText
        })
      );

      // don't allow enter press in text field
      $('#listener-response').keypress(function (event) {
        if (event.keyCode === 13) {
          event.preventDefault()
        }
      });

      // don't show any error message
      $('#error').hide();
      $('#error_incorrect').hide();
      $('#error_2more').hide();
      $('#error_1more').hide();

      // amount of trials to enter correct response
      var trial = 0;

      $('#next').on('click', function () {
        var response = $('#listener-response').val().replace(' ', '');

        // response correct
        if (listener.toLowerCase() === response.toLowerCase()) {
          exp.global_data.botresponse = $('#listener-response').val();
          exp.findNextView();

          // response false
        } else {
          trial = trial + 1;
          $('#error_incorrect').show();
          if (trial === 1) {
            $('#error_2more').show();
          } else if (trial === 2) {
            $('#error_2more').hide();
            $('#error_1more').show();
          } else {
            $('#error_incorrect').hide();
            $('#error_1more').hide();
            $('#next').hide();
            $('#quest-response').css('opacity', '0.2');
            $('#listener-response').prop('disabled', true);
            $('#error').show();
          };
        };
      });
    },
    trials: 1
  };

var intro = {
    name: "intro",
    // introduction title
    title: "ALPS lab Stanford",
    // introduction text
    text:
        "Thank you for participating in our study. In this study you’ll answer questions about 10 conversation excerpts that you’ll read. It will take approximately <strong>15</strong> minutes. Please only participate once and please do not participate using a mobile device!",
    legal_info:
        "<strong>LEGAL INFORMATION</strong>:<br><br>We invite you to participate in a research study on language production and comprehension.<br>Your experimenter will ask you to do a linguistic task such as reading sentences or words, naming pictures or describing scenes, making up sentences of your own, or participating in a simple language game.<br><br>You will be paid for your participation at the posted rate.<br><br>There are no risks or benefits of any kind involved in this study.<br><br>If you have read this form and have decided to participate in this experiment, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at any time without penalty or loss of benefits to which you are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be maintained in all published and written data resulting from the study.<br>You may print this form for your records.<br><br>CONTACT INFORMATION:<br>If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, you should contact the Protocol Director <strong>anonymized for publication</strong> at <br><strong>anonymized for publication</strong><br><br>If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at <strong>anonymized for publication</strong> or toll free at <strong>anonymized for publication</strong>. You can also write to the Stanford IRB, Stanford University, <strong>anonymized for publication</strong>.<br><br>If you agree to participate, please proceed to the study tasks.",
    // introduction's slide proceeding button text
    buttonText: "Begin experiment",
    // render function renders the view
    render: function() {
        var viewTemplate = $("#intro-view").html();

        $("#main").html(
            Mustache.render(viewTemplate, {
                picture: "images/alpslogo.png",
                title: this.title,
                text: this.text,
                legal_info: this.legal_info,
                button: this.buttonText
            })
        );

        var prolificId = $("#prolific-id");
        var IDform = $("#prolific-id-form");
        var next = $("#next");

        var showNextBtn = function() {
            if (prolificId.val().trim() !== "") {
                next.removeClass("nodisplay");
            } else {
                next.addClass("nodisplay");
            }
        };

        if (config_deploy.deployMethod !== "Prolific") {
            IDform.addClass("nodisplay");
            next.removeClass("nodisplay");
        }

        prolificId.on("keyup", function() {
            showNextBtn();
        });

        prolificId.on("focus", function() {
            showNextBtn();
        });

        // moves to the next view
        next.on("click", function() {
            if (config_deploy.deployMethod === "Prolific") {
                exp.global_data.prolific_id = prolificId.val().trim();
            }

            exp.findNextView();
        });
    },
    // for how many trials should this view be repeated?
    trials: 1
};

var beginMainExp = {
    name: "beginMainExp",
    // introduction title
    title: "Read the Story",
    // introduction text
    text:
        "Please read the following conversation snippet. When you're done, press <strong>Next</strong> to show the first question.",
    // introduction's slide proceeding button text
    // buttonText: "Next",
    // render function renders the view
    render: function() {
        var viewTemplate = $("#begin-exp-view").html();

        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                // story_text: exp.trial_info.stories[exp.trial_info.story_id].story
                story_text: exp.trial_info.examples[exp.trial_info.story_id].Context,
                sentence: exp.trial_info.examples[exp.trial_info.story_id].EntireSentence,
                butnotall_sentence: exp.trial_info.examples[exp.trial_info.story_id].ButNotAllSentence
            })
        );

        // moves to the next view
        $("#next").on("click", function() {
            exp.trial_info.story_id += 1;
            exp.findNextView();
        });
    },
    // for how many trials should this view be repeated?
    trials: 1
};

var main = {
    name: "main",
    title: "Questions",
    text: "",
    render: function(CT) {
        // fill variables in view-template
        var viewTemplate = $("#main-view").html();

        //var current_story = exp.trial_info.stories[exp.trial_info.story_id - 1];
        var current_example = exp.trial_info.examples[CT];

        console.log(CT)

        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                //story_text: current_story.story,
                story_text: current_example.Context,
                // question: exp.trial_info.main_trials[CT].question,
                // slider_left: exp.trial_info.main_trials[CT].slider_left,
                // slider_right: exp.trial_info.main_trials[CT].slider_right,

                sentence: current_example.EntireSentence,
                butnotall_sentence: current_example.ButNotAllSentence,
                question: exp.trial_info.main_trials[0].question,
                slider_left: exp.trial_info.main_trials[0].slider_left,
                slider_right: exp.trial_info.main_trials[0].slider_right,
            })
        );

        $("#story-container").css({"display": "block"});

        //if (exp.trial_info.main_trials[CT].question_id == "suspect_conviction") {
        //    $("#checkbox_box").css({"visibility": "hidden"});
        //    $("#conviction_question").css({"display": "block"});
        //}

        var slider = $('#slider');
        var slider_changed = false;
        slider.on('click', function() {
            slider_changed = true;
            $("#error").css({"visibility": "hidden"});
            console.log("Yey, you clicked the slider and possibly changed the value");
        });

        var box_checked = false;
        $('input[id=checkbox]').change(function(){
            if($(this).is(':checked')) {
                box_checked = true;
                $('#slider_box').css("opacity", "0.2");
                $("#error").css({"visibility": "hidden"});
                console.log("Yey, you checked the box!");
                console.log("$('#checkox')");
                console.log($('#checkbox').prop('checked'));
            } else {
                box_checked = false;
                $('#slider_box').css("opacity", "1");
                console.log("Yey, you unchecked the box!");
                console.log("$('#checkox')");
                console.log($('#checkbox').prop('checked'));
            }
        });


        //
        // HIGHLIGHTING
        //
        var highlighting_activated = false;
        var highlighted_text = [];
        var highl_textid = [];

        var parentContainerId = "textDescription";

        if(!window.CurrentSelection){
            console.log("!window.CurrentSelection")
            CurrentSelection = {};
        };

        CurrentSelection.Selector = {};

        // get the current selection
        CurrentSelection.Selector.getSelected = function(){
            console.log("selector gets selected");
            var sel = '';
            if(window.getSelection){
                sel = window.getSelection();
                console.log("window.getSelection");
                console.log("sel: ");
                console.log(sel);
            }
            // for browser compatibility
            else if(document.getSelection){
                sel = document.getSelection();
                console.log("document.getSelection");
            }
            else if(document.selection){
                sel = document.selection.createRange();
                console.log("document.selection -- createRange");
            }
            return sel;
        };

        // function to be called on mouseup
        CurrentSelection.Selector.mouseup = function() {

            console.log("mouseup function activated");
            var st = CurrentSelection.Selector.getSelected();
            if(document.selection && !window.getSelection) {
                // console.log("document.selection && !window.getSelection; range.pasteHTML('<span class='selectedText'>' + range.htmlText + '</span>');");
                // var range = st;
                // range.pasteHTML("<span class='selectedText'>" + range.htmlText + "</span>");
            }
            else if (highlighting_activated) {
                console.log("NOT document.selection && !window.getSelection")

                var range = st.getRangeAt(0);
                var newNode = document.createElement("span");
                newNode.setAttribute("class", "selectedText");
                range.surroundContents(newNode);

                //
                var getTitle = newNode.innerHTML;
                newNode.setAttribute("title", getTitle);

                if(newNode.innerHTML.length > 0) {
                    highlighted_text.push(newNode.getAttribute("title"));
                    highlighted_text.push("||");
                }
                console.log("newNode");
                console.log(newNode);
                //Remove Selection: To avoid extra text selection in IE
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                else if (document.selection){
                    document.selection.empty();
                }
                //
            }
        }

        $(function(){

            // $("#"+parentContainerId).on('mouseup', function(){
                // $('span.selectedText').contents().unwrap();
                // $(this).find('span.popDiv').remove();
            // });

            $("#"+parentContainerId).bind("mouseup",CurrentSelection.Selector.mouseup);
        })

        $("#erase").on("click", function() {
            highlighted_text = [];
            $('span.selectedText').contents().unwrap();
        });

        // END HIGHLIGHTING

        // after you finish picking a slider value

        $("#finish_rating").on("click", function() {

            if (slider_changed == true || box_checked == true || $('#slider').val() != 50 || $('input[name="conv"]:checked').val() != undefined){
                // $('#question').css({"display": "none"});
                $('#question').css({"color": "grey"});
                $('#slider_box').css({"display": "none"});
                $('#conviction_question').css({"display": "none"});
                $('#checkbox_box').css({"display": "none"});
                $('#finish_rating').css({"display": "none"});
                $("#highlight_instruction").css({"display": "block"});
                $("#erase").css({"visibility": "visible"});
                $("#finish_highlight").css({"display": "block"});
                highlighting_activated = true;
                $("#error_slider").css({"display": "none"});
            } else {
                $("#error_slider").css({"display": "block"});
            };

            window.getSelection().removeAllRanges();

        });

        // after you finish highlighting
        $('#finish_highlight').on("click", function() {
            $("#highlight_instruction").css({"color": "grey"});
            $("#explain_instruction").css({"display": "block"});
            $('#expl-container').css({"display": "block"})
            $('#finish_highlight').css({"display": "none"});
            $("#finish_explanation").css({"display": "block"});
        })

        // event listener for buttons; when an input is selected, the response
        // and additional information are stored in exp.trial_info
        $("#finish_explanation").on("click", function() {
            console.log('we\'re done')
            var conv_var;
            if ($('input[name="conv"]:checked').val() == undefined) {
                conv_var = "na";
            } else {
                conv_var = $('input[name="conv"]:checked').val();
            }

            console.log(conv_var);

            if (highlighted_text.length >= 1 && $("#explanation").val().length >= 1){
                console.log(highlighted_text);
                var RT = Date.now() - startingTime; // measure RT before anything else
                var trial_data = {
                    //story_id: exp.trial_info.story_id,
                    // trial_type: exp.trial_info.main_trials[CT].question_id,
                    // trial_number: CT + 1,
                    // headline: current_story.headline,
                    //story: current_story.story,
                    story: current_example.Context,
                    highlighted: highlighted_text,
                    story_whighl: $("#story_text")[0].outerHTML,
                    // question: exp.trial_info.main_trials[CT].question,
                    // slider_left: exp.trial_info.main_trials[CT].slider_left,
                    // slider_right: exp.trial_info.main_trials[CT].slider_right,
                    slider_val: $('#slider').val(),
                    box_checked: $('#checkbox').prop('checked'),
                    // convbox_val: conv_var,
                    explanations: $("#explanation").val(),
                    story_comments: $("#story_comments").val()
                };
                console.log(trial_data);
                // exp.global_data.story_comments = $("#story_comments").val();
                exp.trial_data.push(trial_data);
                exp.findNextView();
            } else {
                if (highlighted_text.length < 1) {
                    console.log("error_highlight");
                    $("#error_highlight").css({"display": "block"});
                }
                if ($("#explanation").val().length < 1)
                    $("#error_explanation").css({"display": "block"});
                
            };
        });

        // record trial starting time
        var startingTime = Date.now();
    },
    trials: all_stims.slice(0, 10).length,
    data: all_stims.slice(0, 10)
};

var postTest = {
    name: "postTest",
    title: "Additional Info",
    text:
        "Answering the following questions is optional, but will help us understand your answers.",
    buttonText: "Continue",
    render: function() {
        var viewTemplate = $("#post-test-view").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                buttonText: this.buttonText
            })
        );

        $("#next").on("click", function(e) {
            // prevents the form from submitting
            e.preventDefault();

            // records the post test info
            exp.global_data.HitCorrect = $("#HitCorrect").val();
            exp.global_data.age = $("#age").val();
            exp.global_data.gender = $("#gender").val();
            exp.global_data.education = $("#education").val();
            exp.global_data.languages = $("#languages").val();
            exp.global_data.enjoyment = $("#enjoyment").val();
            exp.global_data.comments = $("#comments")
                .val()
                .trim();
            exp.global_data.endTime = Date.now();
            exp.global_data.timeSpent =
                (exp.global_data.endTime - exp.global_data.startTime) / 60000;

            // moves to the next view
            exp.findNextView();
        });
    },
    trials: 1
};

var thanks = {
    name: "thanks",
    message: "Thank you for taking part in this experiment!",
    render: function() {
        var viewTemplate = $("#thanks-view").html();

        // what is seen on the screen depends on the used deploy method
        //    normally, you do not need to modify this
        if (
            config_deploy.is_MTurk ||
            config_deploy.deployMethod === "directLink"
        ) {
            // updates the fields in the hidden form with info for the MTurk's server
            $("#main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message
                })
            );
        } else if (config_deploy.deployMethod === "Prolific") {
            $("main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message,
                    extraMessage:
                        "Please press the button below to confirm that you completed the experiment with Prolific<br />" +
                        "<a href=" +
                        config_deploy.prolificURL +
                        ' class="prolific-url">Confirm</a>'
                })
            );
        } else if (config_deploy.deployMethod === "debug") {
            $("main").html(Mustache.render(viewTemplate, {}));
        } else {
            console.log("no such config_deploy.deployMethod");
        }

        exp.submit();
    },
    trials: 1
};
