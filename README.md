# ZchatAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


angular环境搭建运行
1：angular版本兼容性确认
https://angular.dev/reference/versions
angular版本选择： v20
nodejs版本选择： v24

2：nodejs下载安装
下载：
官方下载https://nodejs.org/en/download 版本24.2.0 独立二进制zip
安装：
解压并添加path环境变数

3：安装 Angular CLI （https://angular.dev/installation#install-angular-cli）
npm install @angular/cli
npm install -g @angular/cli

4：创建新项目
ng new zblog-angular

5:添加Angular Material支持
ng add @angular/material

6:添加pwa支持
ng add @angular/pwa

7：在本地运行新项目
cd zblog-angular
npm start

8：编译发布包
npm run build
