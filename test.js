function debounce(func, timeout = 1000) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

// Example
// 1초 동안 호출된 함수 중 마지막 함수만 호출.
const debouncedLog = debounce(num => console.log("num : ", num), 1000);

debouncedLog(1);
debouncedLog(2);
debouncedLog(3);

setTimeout(() => {
	debouncedLog(4);
}, 2000);
