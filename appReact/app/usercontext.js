import React, { createContext, useState, useContext } from "react";

// Crée le contexte avec une valeur par défaut null
const UserContextInstance = createContext(null);

// Provider qui enveloppe toute l'app et partage le state user
function UserProvider({ children }) {
  const [user, setUser] = useState({
    role: null,
    id: null,
  });

  // Fonction pour mettre à jour l'utilisateur (role + id)
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <UserContextInstance.Provider value={{ user, updateUser }}>
      {children}
    </UserContextInstance.Provider>
  );
}

// Hook personnalisé pour consommer le contexte plus facilement
export const useUserContext = () => {
  const context = useContext(UserContextInstance);
  if (!context) {
    throw new Error("useUserContext doit être utilisé à l'intérieur d'un UserProvider");
  }
  return context;
};

export { UserProvider };

