import type { IQuorum } from "packages/types/src/vote/voteModel";
import { getConnectionModel } from "../mongo/model/connection";
import { getVoterModel } from "../mongo/model/voter";

export async function computeInstantQuorum(
  spaceSlug: string,
): Promise<IQuorum> {
  const [ConnectionModel, VoterModel] = await Promise.all([
    getConnectionModel(),
    getVoterModel(),
  ]);

  const [connections, voters] = await Promise.all([
    ConnectionModel.find({ spaceSlug }),
    VoterModel.find({ spaceSlug }),
  ]);

  const weightMap = voters.reduce<Record<string, number>>((acc, voter) => {
    acc[voter.email] = voter.count;
    return acc;
  }, {});

  const liveUsers = Array.from([...new Set(connections.map((c) => c.email))]);

  const liveWeight = liveUsers.reduce((acc, email) => {
    const w = weightMap[email] ?? 0;
    return acc + w;
  }, 0);

  const totalWeight = voters.reduce((acc, v) => {
    return acc + v.count;
  }, 0);

  return {
    at: new Date().toISOString(),
    spaceSlug,
    liveUsers,
    totalWeight,
    liveWeight,
  };
}
