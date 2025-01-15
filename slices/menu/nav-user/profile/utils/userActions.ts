type ToastFunction = {
  (props: {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
  }): void;
}

export async function handleLogout(logout: () => Promise<void>, toast: ToastFunction) {
  try {
    await logout()
    toast({
      title: "Logging out...",
      description: "You will be redirected to the login page.",
    })
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to logout. Please try again.",
      variant: "destructive",
    })
  }
}

export function showKeyboardShortcuts(toast: ToastFunction) {
  toast({
    title: "Keyboard Shortcuts",
    description: "Press '?' to view all keyboard shortcuts",
  })
}
