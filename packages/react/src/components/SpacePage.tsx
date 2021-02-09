import type { ISpace } from "@amfa-team/space-service-types";
import type {
  LoginDictionary,
  LogoutDictionary,
  RegisterDictionary,
  RestrictedPageDictionary,
} from "@amfa-team/user-service";
import { RestrictedPage } from "@amfa-team/user-service";
import React, { useMemo } from "react";
import { useSpace } from "../api/space/useSpace";

interface SpacePageProps {
  slug: string;
  LoadingComponent: () => JSX.Element;
  children: (space: ISpace | null) => JSX.Element;
  loginDictionary: LoginDictionary;
  logoutDictionary: LogoutDictionary;
  registerDictionary: RegisterDictionary;
  dictionary: RestrictedPageDictionary;
  onClose: () => void;
}

export function SpacePage(props: SpacePageProps) {
  const {
    slug,
    LoadingComponent,
    children,
    loginDictionary,
    logoutDictionary,
    registerDictionary,
    dictionary,
    onClose,
  } = props;

  const { isPrivate, space, loading } = useSpace(slug);

  const child = useMemo(() => {
    return children(space);
  }, [children, space]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!isPrivate) {
    return child;
  }

  return (
    <RestrictedPage
      userRole="user"
      spaceSlug={slug}
      loginDictionary={loginDictionary}
      logoutDictionary={logoutDictionary}
      registerDictionary={registerDictionary}
      dictionary={dictionary}
      onClose={onClose}
    >
      {child}
    </RestrictedPage>
  );
}

SpacePage.defaultProps = {
  onClose: () => false,
};
