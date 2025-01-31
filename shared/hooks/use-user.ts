// Temporary hook to get user ID - replace with actual auth system later
export function useUser() {
  // Using the default user ID that matches our migration
  return {
    userId: "b24c5f8a-5e25-4f9d-8492-9bf5f418c408",
    isLoading: false,
    error: null
  };
}
