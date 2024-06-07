const calculateSelectedDesks = (desks) => {
	let selectedDesks = new Set();
	let barCounterIncluded = false; // Flag to track if bar counter is added
	// 遍历桌号数组
	for (let i = 0; i < desks.length; i++) {
		const desk = desks[i];

		// 判断桌号类型
		if (desk > 3) {
			// Add bar counter to the set but don't append it to the string yet
			selectedDesks.add('吧台');
			barCounterIncluded = true;
		} else {
			selectedDesks.add(`${desk}号桌`);
		}
	}

	// Append other desk numbers to the string
	let str = Array.from(selectedDesks).filter((desk) => desk !== '吧台').join(",");

	// If bar counter was included, append it to the end
	if (barCounterIncluded) {
		str += str ? `, 吧台` : '吧台';
	}

	return str;
};

export {
	calculateSelectedDesks
}