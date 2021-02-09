import { Action, AnyAction, applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer, { RootState } from './reducers';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, {}, applyMiddleware(thunk));
export const persistor = persistStore(store);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  RootState,
  undefined,
  Action<string>
>;

export const useAppDispatch = (): AppDispatch => useDispatch();
