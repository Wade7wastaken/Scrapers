export class ResultList<T> {
	private readonly results: T[];

	public constructor() {
		this.results = [];
	}

	public add(...items: T[]): void {
		this.results.push(...items);
	}

	public retrieve(): T[] {
		return this.results;
	}

	public length(): number {
		return this.results.length;
	}
}
