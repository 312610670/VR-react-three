/**
 * create store
 */
import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';
// import { ThunkAction } from 'redux-thunk';
import rootReducer, { staticReducers } from './rootReducer';

// store conf
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * @param 一些说明：
 * 1.  当前的项目架构使用的是单个 store + 初始化时会生成的 rootReducer(这个reducer里只有公用的reducer)
 * 1.1 如果需要使用 - 路由懒加载代码分割 - 的模式，那么会导致动态加载的业务模块对应的 reducer 不存在，所以会需要将当前 store 进行合并且重新注入，让业务模块的reducer 可以存在
 *
 * 2.  还有一种设计模式可以参考：项目中分为多个 store , webpack 的 entry 是动态的, 在 build 时使用 npm run build --moduleName
 * 2.1 那么此时每个业务模块的 rootReducer 也就是被 Provider 提供的 store 始终都是会包含当前业务模块的 reducer ，就不会出现以上第一种的情况，也就不需要这个 injectReducer 这个操作
 *
 * - 不倾向某一种 redux 的设计，按照业务来决定即可
 *
 */
const asyncReducers = {};
export function injectReducer(key, reducer) {
  asyncReducers[key] = reducer;
  const newRootReducer = combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
  store.replaceReducer(newRootReducer);
}

// 普通 dispatch
// export type AppDispatch = typeof store.dispatch;

// 每当我们需要访问 Redux 存储状态时（mapState 函数 | useSelector 选择器）
// export type RootState = ReturnType<typeof rootReducer>;

// thunk type
// export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
