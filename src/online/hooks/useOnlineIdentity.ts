import { useState, useEffect } from "react";

const USERNAME_KEY = "spyGame_username";
const CLIENT_ID_KEY = "spyGame_clientId";

export const useOnlineIdentity = () => {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem(USERNAME_KEY),
  );
  const [clientId, setClientId] = useState<string | null>(
    localStorage.getItem(CLIENT_ID_KEY),
  );

  useEffect(() => {
    if (!clientId) {
      const newClientId = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, newClientId);
      setClientId(newClientId);
    }
  }, [clientId]);

  const saveUsername = (name: string) => {
    localStorage.setItem(USERNAME_KEY, name);
    setUsername(name);
  };

  return {
    username,
    clientId,
    saveUsername,
    isIdentitySet: !!username && !!clientId,
  };
};
