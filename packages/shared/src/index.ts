export function helloWorld(
  who: string | null = null,
  from: string | null = null,
): string {
  return from === null
    ? `Hello ${who ?? "World"}`
    : `Hello ${who ?? "World"} from ${from}`;
}
