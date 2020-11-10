var main_trials = [
	// {
	// 	question_id: "evidence",
	// 	// ADD INSERT
	// 	question: "How strong is the <strong>evidence</strong> (if any) that is presented in the text for the main suspect's / suspects' guilt?",
	// 	slider_left: "not at all strong",
	// 	slider_right: "very strong"
	// },
	{
		question_id: "suspect_committedCrime",
		question: "How likely is it that the main suspect is / the main suspects are <strong>guilty</strong>?",
		slider_left: "very unlikely",
		slider_right: "very likely"
	},
	// {
	// 	question_id: "suspect_conviction",
	// 	question: "How <strong>likely</strong> is a <strong>conviction</strong> of the main suspect(s) in the crime?",
	// 	slider_left: "very unlikely",
	// 	slider_right: "very likely"
	// },
	// {
	// 	question_id: "suspect_convictionJustified",
	// 	question: "How <strong>justified</strong> would be / is a <strong>conviction</strong> of the main suspect(s) in the crime?",
	// 	slider_left: "not justified",
	// 	// at all
	// 	slider_right: "very justified"
	// }, 
	{
		question_id: "author_belief",
		question: "How much does the <strong>author</strong> believe that the main suspect is / the main suspects are <strong>guilty</strong>?",
		slider_left: "not at all",
		slider_right: "very much"
	},
	// Strong correlation with info_reliability
	// {
	// 	question_id: "author_trust",
	// 	question: "How much do you <strong>trust</strong> the author?",
	// 	slider_left: "not at all",
	// 	slider_right: "very much"
	// },
	// {
	// 	question_id: "story_subjectivity",
	// 	question: "How <strong>objectively / subjectively</strong> written is the story?",
	// 	slider_left: "very objective",
	// 	slider_right: "very subjective"
	// },
	// {
	// 	question_id: "reader_emotion",
	// 	question: "How <strong>affected</strong> do you feel by the story?",
	// 	slider_left: "not affected",
	// 	slider_right: "very affected"
	// },
	_.shuffle([{
		question_id: "control1_false",
		question: "How likely is it that this story is a <strong>Greek fairy tale</strong>?",
		slider_left: "very unlikely",
		slider_right: "very likely"
	},
	{
		question_id: "control2_false",
		question: "How likely is it that this passage is a <strong>Bible</strong> quote?",
		slider_left: "very unlikely",
		slider_right: "very likely"
	},
	{
		question_id: "control3_true",
		question: "How likely is it that this story contains <strong>more than five words</strong>?",
		slider_left: "very unlikely",
		slider_right: "very likely"
	}])[0]
];

