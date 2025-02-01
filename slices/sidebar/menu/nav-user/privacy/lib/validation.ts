import { PrivacySettings } from "../types"
import { VISIBILITY_OPTIONS } from "../constants"

export function validatePrivacySettings(settings: Partial<PrivacySettings>) {
  // Validate privacy settings
  if (settings.emailVisibility && !Object.values(VISIBILITY_OPTIONS).includes(settings.emailVisibility)) {
    throw new Error("Invalid email visibility option")
  }
  
  if (settings.profileVisibility && !Object.values(VISIBILITY_OPTIONS).includes(settings.profileVisibility)) {
    throw new Error("Invalid profile visibility option")
  }
  
  return true
}
