// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:8888/graphql/admin',
  api_login_url: 'http://localhost:8888/graphql/login',
  api_rest_upload_url: 'http://localhost:8888/upload',
  api_rest_download_url: 'http://localhost:8888/fichier/',
  api_url_utilisateur: 'http://localhost:8888/utilisateur',
  api_url_product: 'http://localhost:8888/produit',
  api_url_pagination: 'http://localhost:8888/pagination',
  api_url_categorie: 'http://localhost:8888/categorie',
  api_url_avisClient: 'http://localhost:8888/avisClient'
};
