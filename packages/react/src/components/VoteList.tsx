import type { ISpace, PollStatus } from "@amfa-team/space-service-types";
import { DotLoader, ErrorShield } from "@amfa-team/theme-service";
import { Box, Divider } from "@chakra-ui/react";
import React from "react";
import { usePollListWithFilter } from "../api/poll/usePollList";
import { useDictionary } from "../i18n/dictionary";
import { Vote } from "./Vote";

export interface VoteListProps {
  space: ISpace;
  websocket: any | null;
  voteActionLabel: string;
}

const startedOnly: PollStatus[] = ["started"];

function RawVoteList(props: VoteListProps) {
  const { websocket, voteActionLabel } = props;
  const { polls, isLoading } = usePollListWithFilter(
    props.space,
    websocket,
    startedOnly,
  );

  if (isLoading) {
    return <DotLoader />;
  }

  return (
    <Box>
      {polls.map((poll, i) => (
        <React.Fragment key={poll.question}>
          {i > 0 && <Divider />}
          <Vote
            poll={poll}
            websocket={websocket}
            voteActionLabel={voteActionLabel}
          />
        </React.Fragment>
      ))}
    </Box>
  );
}

export function VoteList(props: VoteListProps) {
  const dictionary = useDictionary("error");
  return (
    <ErrorShield
      errorTitle={dictionary._default.title}
      errorText={dictionary._default.desc}
      errorRetry={dictionary._default.retry}
    >
      <RawVoteList {...props} />
    </ErrorShield>
  );
}
