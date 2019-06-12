const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3')
const fs = require('fs')

const visualRecognition = new VisualRecognitionV3({
	version: '2018-03-19',
	iam_apikey: 'nOUfWDYvNDDiUINRm5CCI0dtmV-g7Iww0JyH3Xxg99v8'
});

const images_file= fs.createReadStream('./normal(1).jpeg')
const classifier_ids = ["DefaultCustomModel_1266334953"]
const threshold = 0.6

const params = {
	images_file: images_file,
	classifier_ids: classifier_ids,
	threshold: threshold
};

visualRecognition.classify(params, function(err, response) {
	if (err) { 
		console.log(err)
	} else {
		console.log(JSON.stringify(response))
	}
})
