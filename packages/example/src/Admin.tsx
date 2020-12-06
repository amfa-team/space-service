import { AdminApp, SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import useLocalStorage from "react-use-localstorage";

const endpoint = process.env.API_ENDPOINT ?? "";

function Admin(): ReactElement {
  const [secret, setSecret] = useLocalStorage("API_SECRET", "super-SECRET");
  return (
    <>
      <form noValidate autoComplete="off">
        <label htmlFor="secret">API Secret</label>
        <input
          id="secret"
          value={secret}
          onChange={(e) => {
            setSecret(e.target.value);
          }}
        />
      </form>
      <SpaceServiceSettings settings={{ endpoint, secret }}>
        <AdminApp />
      </SpaceServiceSettings>
    </>
  );
}

export default Admin;
