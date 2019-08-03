
const config = require('../config');
const data = require('../../data');
const createDescribe = require('./createDescribe');

const usedApiPaths = [];

const doWithRecursive = (apis, path, defineJs) => {
	Object.keys(apis).forEach(key => {
		const item = apis[key];

		if (Object.keys(item).length) {
			const apiPath = path + ' / ' + key;
			doWithRecursive(item, apiPath, defineJs);
		}
		else {
			if (usedApiPaths.indexOf(path) >= 0) return;

			createDescribe(path, defineJs, {isOnlyApiPath: true, usedApiPaths});
			usedApiPaths.push(path);
		}
	});
};

const fn = () => {
	const serviceNames = data.serviceNames;
	const testOptions = data.testOptions;

	serviceNames.forEach(serviceName => {

		// Only test the testing api service
		if (testOptions.isFromApiService && testOptions.serviceName !== serviceName && testOptions.serviceName !== 'api') return;

		const title = serviceName === 'default' ? 'api' : serviceName;
		const sysName = data.serviceSysNames[serviceName];
		const defineJs = data.defineJs[sysName];

		if (config.catalogs) {
			const apis = data.core[sysName].api;
			doWithRecursive(apis, title, defineJs);
		}
		else {
			createDescribe(title, defineJs);
		}
	});
};

module.exports = fn;
