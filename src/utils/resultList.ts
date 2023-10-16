export class ResultList<T> {
	private readonly results: T[];
	private readonly preventDuplicates: boolean;

	public constructor(preventDuplicates = false) {
		this.results = [];
		this.preventDuplicates = preventDuplicates;
	}

	public add(...items: T[]): void {
		for (const item of items) {
			if (this.preventDuplicates && this.results.includes(item)) continue;
			this.results.push(item);
		}
	}

	public retrieve(): T[] {
		return this.results;
	}

	public length(): number {
		return this.results.length;
	}
}
