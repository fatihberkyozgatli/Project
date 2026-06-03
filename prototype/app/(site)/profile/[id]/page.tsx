import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile-view";
import { currentUser, getUser } from "@/lib/mock";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = getUser(id);
  if (!user) notFound();
  return <ProfileView user={user} isMe={user.id === currentUser.id} />;
}
