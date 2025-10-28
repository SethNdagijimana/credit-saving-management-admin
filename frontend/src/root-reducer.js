import { combineReducers } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import userManagementReducer from "./slices/user_management_slice"
const rootReducer = combineReducers({
  userMngmt: userManagementReducer
})

const persistConfig = {
  key: "root",
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const CreditAppReducer = (state, action) => {
  switch (action.type) {
    case "LOGOUT":
      state = undefined
      storage.removeItem("persist:root")
      localStorage.removeItem("token")
      break
    case "persist/PERSIST":
    case "persist/REHYDRATE":
    case "@@INIT":
      break
    default:
  }
  return persistedReducer(state, action)
}

export default CreditAppReducer
