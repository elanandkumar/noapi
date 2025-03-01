
// The minimized api definition is just some demo urls,
// without the properties "api", "title", "url", "params", "result" and "test".

// The api definition can be simplified like above when the project is just started.

// It is recommended to identify the test cases ASAP to ensure that development goals do not deviate.
// Learn more:
// 		01-define-API-and-test-cases-with-array
// 		02-define-API-and-test-cases-with-object
//		03-define-API-and-test-cases-with-file
//		04-define-API-and-test-cases-[completely]
//		06-define-API-with-empty-file


const me = [
	'http://localhost:3000/bill/form/crud?formName=trader',
	'http://localhost:3000/info/form/crud?formName=goods',
	'http://localhost:3000/info/form/crud?formName=employee',
];

// Equal to:
//		const me = [
//
//			{
//				url: 'http://localhost:3000/bill/form/crud?formName=trader',
//			},
//
//			{
//				url: 'http://localhost:3000/info/form/crud?formName=goods',
//			},
//
//			{
//				url: 'http://localhost:3000/info/form/crud?formName=employee',
//			},
//
//		];

module.exports = me;
