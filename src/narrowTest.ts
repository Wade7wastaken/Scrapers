interface GoalType {
	first: number;
	second: string;
}

function isGoalType(obj: unknown): obj is GoalType {
	return (
		typeof obj === "object" && obj !== null && "abc" in obj && "def" in obj
	);
}

const narrow = (value: unknown): GoalType | undefined => {
	if (typeof value !== "object") return undefined;

	if (value === null) return undefined;

	if (!("first" in value) || typeof value.first !== "number") return undefined;
	if (!("second" in value) || typeof value.second !== "string") return undefined;

	const newVal = {
		first: value.first,
		second: value.second,
	};

	return newVal;
};

const something2 = (m: unknown): GoalType | undefined => {
	return isGoalType(m) ? m : undefined;
};
