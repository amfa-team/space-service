import type { ISpace } from "@amfa-team/space-service-types";
import { DotLoader, ErrorShield } from "@amfa-team/theme-service";
import { Box, Divider } from "@chakra-ui/react";
import React from "react";
import { usePollListWithFilter } from "../api/poll/usePollList";
import { useDictionary } from "../i18n/dictionary";
import { Vote } from "./Vote";

export interface VoteListProps {
  space: ISpace;
}

function RawVoteList(props: VoteListProps) {
  const { polls, isLoading } = usePollListWithFilter(props.space, ["started"]);

  if (isLoading) {
    return <DotLoader />;
  }

  return (
    <Box>
      {polls.map((poll, i) => (
        <React.Fragment key={poll.question}>
          {i > 0 && <Divider />}
          <Vote poll={poll} />
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
