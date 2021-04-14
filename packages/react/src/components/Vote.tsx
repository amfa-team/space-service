import type { IPoll } from "@amfa-team/space-service-types";
import { DotLoader, ErrorShield } from "@amfa-team/theme-service";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useVote } from "../api/poll/useVote";
import { useDictionary } from "../i18n/dictionary";
import type { Ws } from "../websocket/Ws";

export interface VoteProps {
  poll: IPoll;
  websocket: Ws | null;
}

function RawVote(props: VoteProps) {
  const { poll, websocket } = props;
  const {
    isLoading,
    onSubmitVote,
    setChoice,
    isVoting,
    choice,
    canVote,
  } = useVote(poll, websocket);

  if (isLoading) {
    return <DotLoader />;
  }

  return (
    <Box>
      <FormControl>
        <FormLabel mb="8">
          <Heading size="h4" color="white">
            {poll.question}
          </Heading>
        </FormLabel>
        <RadioGroup
          onChange={setChoice}
          value={choice}
          name={poll.question}
          mb="8"
        >
          <Stack>
            {poll.choices.map((c) => {
              return (
                <Radio
                  key={c}
                  value={c}
                  isDisabled={!canVote}
                  colorScheme="secondary"
                >
                  <Text
                    variant="normal"
                    color="white"
                    fontSize="md"
                    fontWeight="semibold"
                  >
                    {c}
                  </Text>
                </Radio>
              );
            })}
          </Stack>
        </RadioGroup>
        <Button
          onClick={onSubmitVote}
          isLoading={isVoting}
          isDisabled={isVoting || !canVote}
          size="lg"
          colorScheme="whatsapp"
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
