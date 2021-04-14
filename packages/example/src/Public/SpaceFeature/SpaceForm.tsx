import { Button, Container, Input } from "@chakra-ui/react";
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
    <Container maxW="container.lg">
      <form onSubmit={onSubmit}>
        <Input
          type="text"
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
        />
        <Button type="submit">Go!</Button>
      </form>
    </Container>
  );
}
