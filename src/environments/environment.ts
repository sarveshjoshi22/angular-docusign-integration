// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // docusign credentials
  accountId: 10516189,
  account_id: 'dea15dbe-056c-4450-a049-644b1c39de38',
  authUrl: 'https://account-d.docusign.com/oauth/auth',
  baseUrlInfo: '/oauth/userinfo',
  baseUrl: '/restapi/v2.1/accounts',
  clientId: 'c0f73303-538a-4f3b-88d5-5a1ed56a4db3',
  redirectUrl: 'http://127.0.0.1:4200/setState/'
};
