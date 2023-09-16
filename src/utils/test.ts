import axios, { AxiosResponse, AxiosError } from "axios";

async function retryAxiosGet<T>(
	url: string,
	retries = 5,
	delayMs = 1000
): Promise<T | undefined> {
	try {
		const response: AxiosResponse<T> = await axios.get(url);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;

		// Check if we've exceeded the maximum number of retries
		if (retries === 0) {
			console.error("Max retries exceeded. Giving up.");
			return undefined;
		}

		// Check if the error is retriable (e.g., network error or server error)
		if (axiosError.isAxiosError && axiosError.response) {
			const { status } = axiosError.response;
			if (status === 404) {
				console.error("Un-retriable 404 error. Giving up.");
				return undefined;
			}

			console.error(
				`Retriable error: ${axiosError.message}. Retrying in ${delayMs}ms...`
			);
			await new Promise((resolve) => setTimeout(resolve, delayMs));

			// Increase the delay for the next retry
			const nextDelayMs = delayMs * 2;

			// Recursively retry the request
			return retryAxiosGet(url, retries - 1, nextDelayMs);
		} else {
			console.error("Un-retriable error:", axiosError.message);
			return undefined;
		}
	}
}

// Example usage:
async function main() {
	const url = "https://jsonplaceholder.typicode.com/posts/1000"; // Simulating a 404 error

	const result = await retryAxiosGet(url);

	if (result === undefined) {
		console.log(
			"Request failed after 5 retries or due to unretriable error."
		);
	} else {
		console.log("Data:", result);
	}
}

main();
