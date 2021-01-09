import { AdminApp, SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { NavLink, useParams } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";

const endpoint = process.env.API_ENDPOINT ?? "";

function Admin(): ReactElement {
  const { pageName = "space" } = useParams<{
    pageName?: "space" | "permission";
  }>();
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
      <div>
        <ul>
          <li>
            <NavLink to="/admin/space">Space</NavLink>
          </li>
        </ul>
      </div>
      <SpaceServiceSettings settings={{ endpoint, secret }}>
        <AdminApp current={pageName} />
      </SpaceServiceSettings>
    </>
  );
}

export default Admin;
