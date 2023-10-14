const combine = (a: RegExp, b: RegExp): RegExp =>
	new RegExp(String(a).slice(1, -1) + String(b).slice(1, -1));

export const url =
	/^https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+./:=?@~-]*)/;

export const stopAtQuot = combine(url, /(?=&quot)/);

export const alphaNumeric = /^\w*/;

export const text = /^[\s\w]*/;
