export interface Config {
  name: string
  version: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/

export function validateConfig(config: Config): ValidationResult {
  const errors: string[] = []

  if (!config.name) {
    errors.push('name darf nicht leer sein')
  }

  if (!config.version) {
    errors.push('version darf nicht leer sein')
  } else if (!SEMVER_REGEX.test(config.version)) {
    errors.push('version muss semver-Format haben (x.y.z)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
