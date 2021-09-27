// customize the experiment by specifying a view order and a trial structure
exp.customize = function() {
    // record current date and time in global_data
    this.global_data.startDate = Date();
    this.global_data.startTime = Date.now();
    // specify view order
    /*this.views_seq = [
        botcaptcha,
        intro,
        beginMainExp,
        main,
        beginMainExp,
        main2,
        beginMainExp,
        main3,
        beginMainExp,
        main4,
        beginMainExp,
        main5,
        postTest,
        thanks
    ];
    */
    this.views_seq = [botcaptcha, intro, beginMainExp, main, postTest, thanks]

    // prepare information about trials (procedure)
    // randomize main trial order, but keep practice trial order fixed
    this.trial_info.main_trials = _.shuffle(main_trials);

    // only take first XXX blocks (global across participants)
    var selected_blocks = story.slice(100,150);
    // shuffle these blocks
    var shuffled_blocks = _.shuffle(selected_blocks);
    // select the first two
    var story_blocks = _.flatten(shuffled_blocks.slice(0,2));
    // sample 5 stories randomly
    // this.trial_info.stories = _.shuffle(story_blocks).slice(0,5);

    this.trial_info.examples = all_stims;

    // console.log(selected_blocks);

    // console.log("this.trial_info.stories");
    // console.log(this.trial_info.stories);

    console.log("this.trial_info.examples");
    console.log(this.trial_info.examples);

    this.trial_info.story_id = 0;

    // adds progress bars to the views listed
    // view's name is the same as object's name
    // this.progress_bar_in = ["beginMainExp", "main", "main2", "main3", "main4", "main5", "main6", "main7", "main8", "main9", "main10"];
    this.progress_bar_in = ['beginMainExp', 'main']
    // this.progress_bar_in = ['practice', 'main'];
    // styles: chunks, separate or default
    this.progress_bar_style = "default";
    // the width of the progress bar or a single chunk
    this.progress_bar_width = 100;
};
