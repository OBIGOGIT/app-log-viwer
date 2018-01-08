import * as Type from './actionType'

export function setSelectedLogs (logs) {
  return {
    type: Type.SELECTED_SET_LOG,
    logs
  }
}
