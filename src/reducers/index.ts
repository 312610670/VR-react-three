
import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
import config from './config'

const staticReducers = {config}
const rootReducer =combineReducers(staticReducers)

// store conf
const store = configureStore({
  reducer: rootReducer,
});



// 注入 reducer
const asyncReducers: LooseObject = {};
export function injectReducer<State>(key: string, reducer: Reducer<State>) {
  asyncReducers[key] = reducer;
  const newRootReducer = combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
  store.replaceReducer(newRootReducer);
}

// 普通 dispatch
export type AppDispatch = typeof store.dispatch;

// 每当我们需要访问 Redux 存储状态时（mapState 函数 | useSelector 选择器）
export type RootState = ReturnType<typeof rootReducer>;

// thunk type
// export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;