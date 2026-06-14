import { ProfileView } from "@/components/profile-view";
import { currentUser } from "@/lib/mock";

export default function MyProfilePage() {
  return <ProfileView user={currentUser} isMe />;
}
