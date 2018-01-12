import * as Type from './actionType'

export function setDetailLog (log) {
  return {
    type: Type.SET_DETAIL_LOG,
    log
  }
}
