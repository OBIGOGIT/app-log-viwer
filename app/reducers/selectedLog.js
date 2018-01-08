import * as Type from '../actions/actionType'
const initialState = {
  logs: []
}
export default (state = initialState, action) => {
  switch (action.type) {
    case Type.SELECTED_SET_LOG:
      state.logs = action.logs
      return {...state}
    default:
      return state
  }
}
