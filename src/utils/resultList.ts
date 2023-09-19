export class ResultList<T> {
	private readonly results: T[];

	public constructor() {
		this.results = [];
	}

	public add(item: T): void {
		this.results.push(item);
	}

	public retrieve(): T[] {
		return this.results;
	}
}
