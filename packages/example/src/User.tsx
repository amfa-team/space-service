import type { ResetPassQuery } from "@amfa-team/user-service";
import {
  UserModalPage,
  defaultModelPageDictionary,
} from "@amfa-team/user-service";
import qs from "qs";
import type { ReactElement } from "react";
import React, { useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

function User(): ReactElement {
  const location = useLocation();
  const history = useHistory();

  const goToHome = useCallback(() => {
    history.push("/");
  }, [history]);

  const resetPassQuery = useMemo((): ResetPassQuery | null => {
    if (!location.pathname.startsWith("/reset")) {
      return null;
    }

    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    return {
      reqId: `${query.reqId}`,
      userId: `${query.userId}`,
      onReset: goToHome,
    };
  }, [location, goToHome]);

  const invitationQuery = useMemo(() => {
    if (!location.pathname.startsWith("/invite")) {
      return null;
    }

    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    return {
      invitationToken: `${query.invitationToken}`,
      onRegister: goToHome,
      onCancel: goToHome,
      onVerified: (redirect: string | null = null) => {
        if (redirect) {
          history.push(redirect);
        } else {
          goToHome();
        }
      },
    };
  }, [location, goToHome, history]);

  return (
    <UserModalPage
      dictionary={defaultModelPageDictionary.fr}
      resetPassQuery={resetPassQuery}
      invitationQuery={invitationQuery}
    />
  );
}

export default User;
