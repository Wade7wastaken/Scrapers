export class ResultList<T> {
	private results: T[];

	constructor() {
		this.results = [];
	}

	add(item: T): void {
		this.results.push(item);
	}

	retrieve(): T[] {
		return this.results;
	}
}
