// 创建重用策略
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

/**
 * 路由重用策略
 */
export class SimpleReuseStrategy implements RouteReuseStrategy {
    // 保存路由快照
    // [key:string] 键为字符串类型
    // DetachedRouteHandle 值为路由处理器
    public static snapshots: { [key: string]: DetachedRouteHandle } = {};

    /**
     * 从缓存中获取快照
     * @param {ActivatedRouteSnapshot} route
     * @return {DetachedRouteHandle | null}
     */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return route.routeConfig ? SimpleReuseStrategy.snapshots[route.routeConfig.path] : null;
    }

    /**
     * 是否允许还原
     * @param {ActivatedRouteSnapshot} route
     * @return {boolean} true-允许还原
     */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return route.routeConfig && SimpleReuseStrategy.snapshots[route.routeConfig.path] ? true : false;
    }

    /**
     * 确定是否应该分离此路由（及其子树）以便以后重用
     * @param {ActivatedRouteSnapshot} route
     * @return {boolean}
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // useCache 为自定义数据
        return route.routeConfig && route.routeConfig.data && route.routeConfig.data.useCache;
    }

    /**
     * 进入路由触发, 判断是否为同一路由
     * @param {ActivatedRouteSnapshot} future
     * @param {ActivatedRouteSnapshot} curr
     * @return {boolean}
     */
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        // future - 未来的(下一个)路由快照
        return future.routeConfig === curr.routeConfig;
    }

    /**
     * 保存路由
     * @param {ActivatedRouteSnapshot} route
     * @param {DetachedRouteHandle | null} handle
     */
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        // 通过 Route.path 映射路由快照, 一定要确保它的唯一性
        // 也可以通过 route.routeConfig.data.uid 或其他可以确定唯一性的数据作为映射key
        // 作者这里能够确保 path 的唯一性
        SimpleReuseStrategy.snapshots[route.routeConfig.path] = handle;
    }
}
