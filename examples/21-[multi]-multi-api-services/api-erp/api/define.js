
// See "04-define-API-and-test-cases-[completely]" to learn more.

const me = [
	{
		url: 'http://localhost:3000/erp:/report/purchase/order?billid=1',
		result: {
			"success": true,
			"data": {
				"billid": "1"
			}
		}
	}
];

module.exports = me;
