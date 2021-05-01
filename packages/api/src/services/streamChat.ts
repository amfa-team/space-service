import type { ISpaceDocument } from "@amfa-team/space-service-types";
import type { IPublicUserData } from "@amfa-team/user-service-types";
import { StreamChat } from "stream-chat";

const client = new StreamChat(
  process.env.STREAM_IO_API_KEY ?? "",
  process.env.STREAM_IO_API_SECRET ?? "",
  {
    timeout: 20_000,
  },
);

async function createChannelType() {
  const channelTypes = await client.listChannelTypes();
  const settings = {
    max_message_length: 2000,
    typing_events: false,
    read_events: false,
    connect_events: true,
    search: true,
    reactions: true,
    replies: true,
    mutes: false,
    uploads: true,
    url_enrichment: false,
    permissions: channelTypes.channel_types.livestream.permissions,
  };
  if (!channelTypes.channel_types.sbs) {
    await client.createChannelType({ name: "sbs", ...settings });
  } else {
    await client.updateChannelType("sbs", settings);
  }
}

export async function createSpaceChannelChat(space: ISpaceDocument | null) {
  if (!space) return null;
  await createChannelType();
  const channel = client.channel("sbs", space._id, {
    name: space.name,
    image: space.imageUrl,
    created_by_id: "602c111b44546b00091292e4",
  });
  await channel.create();
  return channel;
}

export async function createParticipantChatToken(
  user: IPublicUserData | null,
  spaceSlug: string,
  channel: any,
) {
  await client.upsertUser({
    id: user?.id ?? "",
    name: `${user?.firstName} ${user?.lastName}`,
    role: user?.permissions[spaceSlug] ?? "user",
  });
  await channel.addMembers([user?.id]);
  const token = client.createToken(user?.id ?? "");
  return token;
}
