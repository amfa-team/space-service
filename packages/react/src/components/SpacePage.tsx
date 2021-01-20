import type { ISpace } from "@amfa-team/space-service-types";
import type {
  LoginDictionary,
  LogoutDictionary,
  RegisterDictionary,
  RestrictedPageDictionary,
} from "@amfa-team/user-service";
import { RestrictedPage } from "@amfa-team/user-service";
import React from "react";
import { useSpace } from "../api/space/useSpace";

interface SpacePageProps {
  slug: string;
  LoadingComponent: () => JSX.Element;
  children: (space: ISpace | null) => JSX.Element;
  loginDictionary: LoginDictionary;
  logoutDictionary: LogoutDictionary;
  registerDictionary: RegisterDictionary;
  dictionary: RestrictedPageDictionary;
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
  } = props;

  const { isPrivate, space, loading } = useSpace(slug);

  if (loading) {
    return <LoadingComponent />;
  }

  if (space === null && !isPrivate) {
    return children(space);
  }

  return (
    <RestrictedPage
      userRole="user"
      spaceSlug={slug}
      loginDictionary={loginDictionary}
      logoutDictionary={logoutDictionary}
      registerDictionary={registerDictionary}
      dictionary={dictionary}
    >
      {children(space)}
    </RestrictedPage>
  );
}
