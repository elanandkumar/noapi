
const _ = require('lodash');

const getValidKeys = (obj) => {
	let keys = Object.keys(obj);
	if (keys.length === 0) {
		keys = Object.keys(obj.__proto__);
	}

	if (keys.length === 0) return;
	if (keys.indexOf('constructor') >= 0) return;

	return keys;
};

/** @name lib.apiParser */
const me = {

	// {bill: {form: {crud: {}}}} => "/bill/form/crud"
	objectToApis(obj, path = '', arr = []) {
		const keys = getValidKeys(obj);
		if (!keys) return arr;

		keys.forEach(key => {
			const o = obj[key];
			const subPath = path + '/' + key;

			if (Object.keys(o).length === 0) {
				arr.push(subPath);
			}
			else {
				if (typeof o === 'object') {
					me.objectToApis(o, subPath, arr);
				}
			}
		});

		return arr;
	},

	// "/bill/form/crud" => {bill: {form: {crud: {}}}}
	apiToObject(api) {
		const obj = {};
		let parent = obj;

		const nodes = api.split('/'); // ['', 'bill', 'form', 'crud']
		while (nodes.length) {
			const node = nodes.shift();
			if (node === '') continue;

			parent[node] = {};
			parent = parent[node];
		}

		return obj;
	},

	// ["/bill/form/crud", "/bill/form/getFields"] => {bill: {form: {crud: {}, getFields: {}}}}
	apisToObject(apisArray) {
		const obj = {};
		apisArray.forEach(api => {
			const branch = this.apiToObject(api);
			_.merge(obj, branch);
		});

		return obj;
	},

	// Parse api url:
	// 		1. If the request comes from web, then the url is like below:
	// 	  	   /forms:/bill/dropDownList?formname=purchaseOrder&listname=trader

	// 		2. If the request comes from api, then the url is like below:
	// 	  	   forms:/bill/dropDownList
	apiUrlToSysNameAndApi(url) {

		// api = "/forms:/bill/dropDownList"
		let api = url.split('?')[0];
		let sysName;

		if (api.indexOf(':') === -1) { // "/bill/dropDownList" without "/forms:"
			sysName = 'default';
		}
		else {
			const temp = api.split(':'); // '/forms:/info/dropdownlist'
			sysName = temp[0].replace("/", ''); // 'forms'
			api = temp[1]; // '/info/dropdownlist'
		}

		return {sysName, api};
	},

};

module.exports = me;
