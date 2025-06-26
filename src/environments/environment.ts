// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: 'https://chatun.ngrok2.xiaomiqiu.cn/',
  // basesocket: 'wss://chatun.ngrok2.xiaomiqiu.cn/'
  baseUrl: 'http://localhost:1000/chat/',
  basesocket: 'ws://localhost:1000/chat/',
  signalingServer: 'ws://localhost:1003/signaling',
  APP_ID: "e2f3b794f5ec9ad84151f2248110a0b7",
  APP_TOKEN: "1e25e1742a11be5465f9529f9d2d6d31f6a54006c9d22208100e38605b53e940",
  API_BASE: "https://rtc.live.cloudflare.com/v1/apps/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
