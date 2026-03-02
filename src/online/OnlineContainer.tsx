import { useOnlineIdentity } from "./hooks/useOnlineIdentity";
import { IdentityModal } from "./components/IdentityModal";
import { OnlineLayout } from "./components/OnlineLayout";

const OnlineContainer = () => {
  const { saveUsername, isIdentitySet } = useOnlineIdentity();

  if (!isIdentitySet) {
    return <IdentityModal onSave={saveUsername} />;
  }

  return <OnlineLayout />;
};

export default OnlineContainer;
