import type { IPoll } from "@amfa-team/space-service-types";
import { DotLoader, ErrorShield } from "@amfa-team/theme-service";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useVote } from "../api/poll/useVote";
import { useDictionary } from "../i18n/dictionary";

export interface VoteProps {
  poll: IPoll;
}

function RawVote(props: VoteProps) {
  const { poll } = props;
  const {
    isLoading,
    onSubmitVote,
    setChoice,
    isVoting,
    choice,
    canVote,
  } = useVote(poll);

  if (isLoading) {
    return <DotLoader />;
  }

  return (
    <Box>
      <FormControl>
        <FormLabel>{poll.question}</FormLabel>
        <RadioGroup onChange={setChoice} value={choice} name={poll.question}>
          <Stack>
            {poll.choices.map((c) => {
              return (
                <Radio key={c} value={c} isDisabled={!canVote}>
                  {c}
                </Radio>
              );
            })}
          </Stack>
        </RadioGroup>
        <Button
          onClick={onSubmitVote}
          isLoading={isVoting}
          isDisabled={isVoting || !canVote}
        >
          Vote
        </Button>
      </FormControl>
    </Box>
  );
}

export function Vote(props: VoteProps) {
  const dictionary = useDictionary("error");
  return (
    <ErrorShield
      errorTitle={dictionary._default.title}
      errorText={dictionary._default.desc}
      errorRetry={dictionary._default.retry}
    >
      <RawVote {...props} />
    </ErrorShield>
  );
}
