const NAMESPACE = 'gesclub'

// Every key carries a version so a format change can read a different key
// instead of choking on whatever the previous release left behind.
function storageKey(name, version) {
  return `${NAMESPACE}:${name}:v${version}`
}

// localStorage throws when storage is disabled or the quota is full. Reads fall
// back and writes are dropped, so the app keeps working from memory instead of
// taking down the render.
export function readStored(name, { version = 1, fallback = null } = {}) {
  try {
    const raw = window.localStorage.getItem(storageKey(name, version))
    return raw === null ? fallback : raw
  } catch {
    return fallback
  }
}

export function writeStored(name, value, { version = 1 } = {}) {
  try {
    window.localStorage.setItem(storageKey(name, version), value)
  } catch {
    // Nothing to do: the value lives in component state for this session.
  }
}

export function removeStored(name, { version = 1 } = {}) {
  try {
    window.localStorage.removeItem(storageKey(name, version))
  } catch {
    // Same as writeStored.
  }
}