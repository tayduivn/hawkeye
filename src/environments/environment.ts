// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // apiUrl: 'http://192.168.3.8/api/v1',
    // fileUrlPath: 'http://keyi.xdrlgroup.com',
    // usFileUrl: 'http://192.168.3.8/storage/',
    // origin: 'http://192.168.3.8',
    // wsOrigin: 'ws://192.168.3.8:2000'

    apiUrl:'http://121.196.179.68:8081/api/v1',
    fileUrlPath:'http://keyi.xdrlgroup.com',
    usFileUrl:'http://121.196.179.68:8081/',
    origin:'http://121.196.179.68:8081',
    wsOrigin: 'ws://121.196.179.68:2000'


    // apiUrl: 'http://121.196.179.68' + '/api/v1',
    // fileUrlPath: 'http://keyi.xdrlgroup.com',
    // usFileUrl: 'http://121.196.179.68' + '/storage/',
    // origin: 'http://121.196.179.68',
    // wsOrigin: 'ws://121.196.179.68:2000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
