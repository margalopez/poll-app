import type { Option, Poll } from '@/@types/db'

const BASE_URL = 'http://localhost:3000'

/**
 * Fetch a poll by ID.
 * `GET /api/poll/:id`
 * @param id 
 * @returns 
 */
export async function fetchPoll(id: number): Promise<Poll> {
	const res = await fetch(`${BASE_URL}/api/poll/${id}`)
	if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to fetch poll')
	return res.json()
}

/**
 * Creates a new poll.
 * `POST /api/poll`
 * @param question - the poll question (e.g. "What's your favorite color?")
 * @param options - array of option labels (e.g. ["Option 1", "Option 2"])
 * @returns the created poll with its options and IDs
 */
export async function createPoll(question: string, options: string[]): Promise<Poll> {
	const res = await fetch(`${BASE_URL}/api/poll`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ question, options }),
	})
	if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to create poll')
	return res.json()
}

/**
 * Casts a vote for a specific option.
 * `POST /api/vote`
 * @param optionId - the ID of the option to vote for
 * @returns the updated options array for the poll
 */
export async function castVote(optionId: number): Promise<{ options: Option[] }> {
	const res = await fetch(`${BASE_URL}/api/vote`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ optionId }),
	})
	if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to cast vote')
	return res.json()
}

/**
 * Subscribes to real-time updates for a poll's options using Server-Sent Events.
 * The server will send an event with the updated options array whenever a vote is cast.
 * `GET /api/events/:pollId`
 * @param pollId - the ID of the poll to subscribe to
 * @param onUpdate - function to call when the options array is updated
 * @returns the EventSource for managing the subscription
 */
export function subscribeToPollEvents(
	pollId: number | string,
	onUpdate: (options: Option[]) => void,
): EventSource {
	const source = new EventSource(`${BASE_URL}/api/events/${pollId}`)
	source.onmessage = (event: MessageEvent) => {
		onUpdate(JSON.parse(event.data) as Option[])
	}
	return source
}
