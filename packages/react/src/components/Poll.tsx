import type { IPoll } from "@amfa-team/space-service-types";
import {
  Box,
  Button,
  Table,
  TableCaption,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { usePollResult } from "../api/poll/usePollResult";
import { useDictionary } from "../i18n/dictionary";
import type { Ws } from "../websocket/Ws";

export interface PollProps {
  poll: IPoll;
  websocket: Ws | null;
}

export function Poll({ poll, websocket }: PollProps) {
  const { isLoading, pollResult, updatePollResult } = usePollResult(
    poll,
    websocket,
  );
  const dictionary = useDictionary("poll");

  return (
    <Box>
      <Text>
        {poll.question}
        <Tag>{poll.status}</Tag>
      </Text>
      <Table size="sm">
        <TableCaption>
          <Button
            onClick={async () => updatePollResult()}
            isDisabled={isLoading}
          >
            {dictionary.result.update}
          </Button>
        </TableCaption>
        <Thead>
          <Tr>
            <Th>{dictionary.result.choiceHeader}</Th>
            <Th isNumeric>{dictionary.result.countHeader}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pollResult.map(([choice, count]) => (
            <Tr key={choice}>
              <Td>{choice}</Td>
              <Td isNumeric>{count}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
