declare global {
  interface Window {
    _keycloakInstance?: Keycloak.KeycloakInstance;
  }
}
// src/app/utils/keycloak.ts
import Keycloak from 'keycloak-js';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL as string;
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM as string;
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID as string;


// Use a global variable to persist across HMR reloads
const globalKeycloak = window._keycloakInstance as Keycloak.KeycloakInstance | undefined;

const keycloak: Keycloak.KeycloakInstance =
  globalKeycloak ||
  new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
  });

if (!globalKeycloak) {
  window._keycloakInstance = keycloak;
}

export default keycloak;
