import type { ISpace } from "@amfa-team/space-service-types";
import { DotLoader, ErrorShield } from "@amfa-team/theme-service";
import {
  Box,
  Button,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useLiveQuorum, useQuorums } from "../api/poll/useQuorum";
import { useWebsocket } from "../api/websocket/useWebsocket";
import { useDictionary } from "../i18n/dictionary";

export interface QuorumProps {
  space: ISpace;
}

function RawQuorum(props: QuorumProps) {
  const dictionary = useDictionary("quorum");

  const { websocket } = useWebsocket(props.space._id);
  const { quorums, isLoading: isQuorumListLoading } = useQuorums(
    props.space,
    websocket,
  );
  const {
    liveQuorum,
    isLoading: isLiveQuorumLoading,
    saveQuorum,
    isSaving,
  } = useLiveQuorum(props.space, websocket);

  if (isQuorumListLoading || isLiveQuorumLoading) {
    return <DotLoader />;
  }

  return (
    <Box>
      <Table size="sm">
        <TableCaption>
          <Button
            onClick={saveQuorum}
            isDisabled={isSaving}
            isLoading={isSaving}
          >
            {dictionary.saveLabel}
          </Button>
        </TableCaption>
        <Thead>
          <Tr>
            <Th>{dictionary.atLabel}</Th>
            <Th>{dictionary.liveUserCount}</Th>
            <Th>{dictionary.liveVoteCount}</Th>
            <Th>{dictionary.totalVoteCount}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {liveQuorum && (
            <Tr key="live">
              <Td>{`${dictionary.liveLabel} (${liveQuorum.at})`}</Td>
              <Td isNumeric>{liveQuorum.liveUsers.length}</Td>
              <Td isNumeric>{liveQuorum.liveWeight}</Td>
              <Td isNumeric>{liveQuorum.totalWeight}</Td>
            </Tr>
          )}
          {quorums.map((quorum) => (
            <Tr key={quorum.at}>
              <Td>{quorum.at}</Td>
              <Td isNumeric>{quorum.liveUsers.length}</Td>
              <Td isNumeric>{quorum.liveWeight}</Td>
              <Td isNumeric>{quorum.totalWeight}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export function Quorum(props: QuorumProps) {
  const dictionary = useDictionary("error");
  return (
    <ErrorShield
      errorTitle={dictionary._default.title}
      errorText={dictionary._default.desc}
      errorRetry={dictionary._default.retry}
    >
      <RawQuorum {...props} />
    </ErrorShield>
  );
}
