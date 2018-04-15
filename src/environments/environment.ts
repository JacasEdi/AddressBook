// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  firebase: {
    apiKey: "AIzaSyA9ONHaNmS8i_5ccj3rfC-6EWV_Ss9ZeVE",
    authDomain: "addressbook-2f0aa.firebaseapp.com",
    databaseURL: "https://addressbook-2f0aa.firebaseio.com",
    projectId: "addressbook-2f0aa",
    storageBucket: "addressbook-2f0aa.appspot.com",
    messagingSenderId: "1043378879975"
  }
};
