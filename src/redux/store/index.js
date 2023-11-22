import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from 'redux/Slices/userSlice';
import appSlice from 'redux/Slices/appSlice';
import orderSlice from 'redux/Slices/orderSlice';
import uploadSlice from 'redux/Slices/uploadSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import paymentSlice from 'redux/Slices/paymentSlice';
const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['app'],
  transforms: [
    encryptTransform({
      secretKey: 'my-super-secret-key',
      onError: function (error) {
        // Handle the error.
        console.log(error, 'its error from encryption');
      },
    }),
  ],
};
const stateSyncConfig = {
  // Define your configuration options here
  // See redux-state-sync documentation for available options
  blacklist: ['persist/PERSIST', 'persist/REHYDRATE'],
};
const stateSyncMiddleware = createStateSyncMiddleware(stateSyncConfig);
const rootReducer = combineReducers({
  app: appSlice,
  user: userSlice,
  order: orderSlice,
  upload: uploadSlice,
  payment:paymentSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(stateSyncMiddleware),
    devTools:process.env.NODE_ENV !== "production"
});
initMessageListener(store);
const persistor = persistStore(store);
export { store, persistor };