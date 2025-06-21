import { configureStore,combineReducers } from "@reduxjs/toolkit";
import studentReducer from "./studentSlice"
import professorReducer from "./ProfessorSlice.js"


import {

    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root_v2',
    version: 1,
    storage,
}
const rootReducer =combineReducers({
    student:studentReducer,
    professor:professorReducer

})
const persistedReducer = persistReducer(persistConfig, rootReducer)


const store= configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})


// const store = configureStore({
//     reducer:{
//         student:studentReducer
//     }
// })

export default store;