import type { ISpace } from "@amfa-team/space-service-types";
import { DotLoader, ErrorShield } from "@amfa-team/theme-service";
import { Box } from "@chakra-ui/react";
import React from "react";
import { usePollList } from "../api/poll/usePollList";
import { useDictionary } from "../i18n/dictionary";
import { Poll } from "./Poll";

export interface PollListProps {
  space: ISpace;
}

function RawPollList({ space }: PollListProps) {
  const { polls, isLoading } = usePollList(space);

  if (isLoading) {
    return <DotLoader />;
  }

  return (
    <Box>
      {polls.map((poll) => {
        return <Poll key={poll._id} poll={poll} />;
      })}
    </Box>
  );
}

export function PollList(props: PollListProps) {
  const dictionary = useDictionary("error");

  return (
    <ErrorShield
      errorTitle={dictionary._default.title}
      errorText={dictionary._default.desc}
      errorRetry={dictionary._default.retry}
    >
      <RawPollList {...props} />
    </ErrorShield>
  );
}
