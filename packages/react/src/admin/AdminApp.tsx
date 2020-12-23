import React from "react";
import AdminPermissions from "./AdminPermissions/AdminPermissions";
import AdminSpaces from "./AdminSpaces/AdminSpaces";

interface AdminAppProps {
  current: "space" | "permission";
}

export function AdminApp(props: AdminAppProps) {
  return (
    <div>
      {props.current === "space" && <AdminSpaces />}
      {props.current === "permission" && <AdminPermissions />}
    </div>
  );
}
