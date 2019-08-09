
// Each of elements in array "me" is an api definition.

// There must be the following properties in the api definition:
//
// 		1. A demo "url" or a "params" (for sending data in testing).
// 		2. A "result" or a "test" (for validating data in testing).
//
//
// When testing:
//
// 		1. Sending data:
//
// 		   "params" 	If the "params" property is exists, post it to server.
//		   "url"		Otherwise, submit the demo "url" to server.
//
// 		2. Validating data:
//
//		   "test" 		If the "test" property is exists, use it as the validator.
//		   "result"		Otherwise, the returned result muse be matches the "result" property exactly.
//
//
// Learn more:
// 		01-api-definition-by-array
// 		02-api-definition-by-object
//		03-api-definition-by-directory
//		04-api-definition-by-pure-directory
//		05-api-definition-[minimally]
//
// /////////////////////////////////////////////


const me = [

	// /////////////////////////////////////////////
	//
	// 1. With params property
	//
	//    The test case will uses "post" method to send it (if exists),
	//    or uses "get" method to submits the demo url.
	//
	// /////////////////////////////////////////////

	{
		url: 'http://localhost:3000/bill/form/crud',
		params: {
			formname: 'trader',
		},

		// Equal to:
		// 		{
		// 			url: 'http://localhost:3000/bill/form/crud?formname=trader',
		// 			params: {
		// 				formname: 'trader',
		// 			},
		// 		},
	},


	// /////////////////////////////////////////////
	//
	// 2. With result property
	//
	//    When testing, the returned result must be matches it exactly
	//    if the test property is omitted or it is "===result".
	//
	// /////////////////////////////////////////////

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',
		result: {
			"success": true,
			"data": {
				"formname": "trader"
			}
		},
	},

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',
		result: {
			"success": true,
			"data": {
				"formname": "trader"
			}
		},

		// It is same as the example previously.
		test: '===result',
	},

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',

		// If the result property is large, save it to a json file in directory /test/comparison.
		// In this case, just open "/test/comparison/bill.form.crud.json" to learn more.
		result: "bill.form.crud",
	},


	// /////////////////////////////////////////////
	//
	// 3. With test property
	//	  It can be an object, a string, a boolean, a regExp, or a function.
	//
	// /////////////////////////////////////////////

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',
		test: {
			formname: 'trader',
		},

		// Equal to:
		// 		test: {
		// 			verify: {
		// 				formname: 'trader',
		// 			}
		// 		}
	},

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',
		test: `"formname":"trader"`,

		// Equal to:
		// 		test: {
		// 			verify: `"formname":"trader"`,
		// 		}
	},

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',
		test: /(trader)|(goodsid)/,

		// Equal to:
		// 		test: {
		// 			verify: /(trader)|(goodsid)/,
		// 		}
	},

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',

		// Verify the value of result.success returns from server
		test: true,

		// Equal to:
		// 		test: {
		// 			verify: true,
		// 		}
	},

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',
		test(result, resultText) {

			// Find the feature string in the result text
			return resultText.indexOf(`"formname":"trader"`) >= 0;
		},

		// Equal to:
		// 		test: {
		// 			verify(result, resultText) {
		// 				return resultText.indexOf(`"formname":"trader"`) >= 0;
		// 			}
		// 		},
	},

	{
		url: 'http://localhost:3000/bill/form/crud?formname=trader',
		test(result, resultText) {

			// Find the specified values in the result object
			return result.data.formname === 'trader';
		},

		// Equal to:
		// 		test: {
		// 			verify(result, resultText) {
		// 				return result.data.formname === 'trader';
		// 			}
		// 		}
	},


	// /////////////////////////////////////////////
	//
	// 4. Complete definition
	//
	//	  Each api can have multiple sets of parameters, and each set of parameters has a test case.
	//
	//    We call the properties "api", "title", "url" collectively as api info, like below:
	//			api info: {api, title, url}
	//
	//    and the properties "params", "result", "test" collectively as doc info, like below:
	//			doc info: {params, result, test}
	//
	// /////////////////////////////////////////////
	{

		// .............................................
		//
		// api info
		//
		// .............................................

		// If omitted, parse from "url"
		api: '/bill/form/crud',

		// If omitted, parse from "api" (such as "Bill - Form - Crud").
		title: 'The title of this api',

		// The demo url for this api
		url: 'http://localhost:3000/bill/form/crud?formname=trader',


		// .............................................
		//
		// doc info
		//
		// .............................................

		// Send it to server. If omitted, parse from url.
		params: {
			formname: 'trader',
		},

		// Get it from server. It can be omitted if not required for testing.
		result: {
			"success": true,
			"data": {
				"formname": "trader"
			}
		},


		// The test case
		// 		For clarity of reading, write it as the sequence below:
		//			{beforeDo, url, getResult, afterDo, verify}
		test: {

			// Call the specific apis before do with test url if needed.
			// 		E.g., insert some data to db before do with test url.
			// 		The beforeDo can be an array, an api, a title, or a url.
			beforeDo: [
				'/bill/form/crud', // by api
				'Bill - Form - Crud', // by title
				'http://localhost:3000/bill/form/crud?formname=trader', // by url
			],

			// The test url. If omitted, use the demo url.
			// 		E.g., the test url carries more parameters than the demo url for specific purposes.
			url: undefined,

			// Explaining how to get the result. If omitted, use the demo url.
			// 		E.g., after deleting the data via test url, re-acquire the data to verify if it is exists.
			// 		The usage is the same as beforeDo.
			getResult: undefined,

			// Call the specific apis after get the returned result if needed.
			// 		E.g., delete the inserted data in before.
			// 		The usage is the same as beforeDo.
			afterDo: undefined,

			// See above section "4. With test ..." for the usage of verify
			verify(result, resultText) {
				return resultText.indexOf(`"formname":"trader"`) >= 0;
			}
		}
	},

	// /////////////////////////////////////////////
	//
	// 5. An api with multiple sets of doc info
	//
	// See "57-[for-test]-multiple-test-cases-for-one-api" for more details.
	//
	// /////////////////////////////////////////////
	{
		// .............................................
		//
		// api info
		//
		// .............................................

		api: '/bill/form/crud',
		title: 'Bill - Form - Crud',
		url: 'http://localhost:3000/bill/form/crud?formname=trader',


		// .............................................
		//
		// multiple sets of doc info
		//
		// .............................................

		docs: [
			/*

			// .............................................
			//
			// doc info
			//
			// .............................................

			{
				params: {
					...
				},

				result: {
					...
				},

				test: {
					...
				}
			}
			* */
		],
	},
];

module.exports = me;
