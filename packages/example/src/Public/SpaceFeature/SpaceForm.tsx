import type { FormEvent } from "react";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export function SpaceForm() {
  const history = useHistory();
  const [spaceName, setSpaceName] = useState("");

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      history.push(`/space/${spaceName}`);
    },
    [history, spaceName],
  );

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={spaceName}
        onChange={(e) => setSpaceName(e.target.value)}
      />
      <button type="submit">Go!</button>
    </form>
  );
}
