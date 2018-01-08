import * as Type from './actionType'

export function setLogs (logs) {
  return {
    type: Type.SET_LOG,
    logs
  }
}
