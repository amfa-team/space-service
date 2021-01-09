import React from "react";
import AdminSpaces from "./AdminSpaces/AdminSpaces";

interface AdminAppProps {
  current: "space" | "permission";
}

export function AdminApp(props: AdminAppProps) {
  return <div>{props.current === "space" && <AdminSpaces />}</div>;
}
