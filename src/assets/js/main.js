import uiInits from './init';


const ready = (callback) => {
	document.readyState != "loading"
		? callback()
		: document.addEventListener("DOMContentLoaded", callback);
};

ready(() => {
	uiInits.init();

});
