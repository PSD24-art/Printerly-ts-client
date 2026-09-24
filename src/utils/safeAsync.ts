export default async function safeAsync<T>(
  promise: Promise<T>,
): Promise<[T, null] | [null, Error]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const fallbackError =
      error instanceof Error ? error : new Error(String(error));
    return [null, fallbackError];
  }
}
