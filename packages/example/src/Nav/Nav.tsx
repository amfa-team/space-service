import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./nav.module.css";

export default function Nav() {
  return (
    <div className={classes.root}>
      <div>Nav:</div>
      <div className={classes.actions}>
        <div>
          <NavLink to="/admin">Admin</NavLink>
        </div>
        <div>
          <NavLink to="/">Home Feature</NavLink>
        </div>
        <div>
          <NavLink to="/space/vaccine">Space Feature</NavLink>
        </div>
        <div>
          <NavLink to="/space/vaccine/quorum">Quorum Feature</NavLink>
        </div>
        <div>
          <NavLink to="/space/vaccine/vote">Vote Feature</NavLink>
        </div>
        <div>
          <NavLink to="/space/vaccine/polls">Polls Feature</NavLink>
        </div>
      </div>
    </div>
  );
}
