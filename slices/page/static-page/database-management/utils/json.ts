export const safeParseJSON = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON response:', text);
    throw new Error('Invalid server response');
  }
};
