import { UserSettings } from "../types"
import { THEMES, LANGUAGES } from "../constants"

export function validateSettings(settings: Partial<UserSettings>) {
  // Validate user settings
  if (settings.theme && !Object.values(THEMES).includes(settings.theme)) {
    throw new Error("Invalid theme option")
  }
  
  if (settings.language && !LANGUAGES.some(lang => lang.code === settings.language)) {
    throw new Error("Invalid language option")
  }
  
  return true
}
