import * as Type from '../actions/actionType'
const initialState = {
  log: undefined
}
export default (state = initialState, action) => {
  switch (action.type) {
    case Type.SET_DETAIL_LOG:
      state.log = action.log
      return {...state}
    default:
      return state
  }
}
