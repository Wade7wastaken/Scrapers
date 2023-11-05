// const combine = (a: RegExp, b: RegExp): RegExp =>
// 	new RegExp(String(a).slice(1, -1) + String(b).slice(1, -1));

const url =
	/^https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,24}\b([\w#%&()+./:=?@~-]*)/;

const number = /^\d+/;

const alphaNumeric = /^\w*/;

const text = /^[\s\w]*/;

const cssColor = /^#[\dA-Fa-f]{3,6}/;

export const regex = {
	url,
	number,
	alphaNumeric,
	text,
	cssColor,
};
