export const generateColorFromUsername = (username) => {
    const colors = ["#FFD700", "#FF8C00", "#ADFF2F", "#40E0D0", "#FF69B4"];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

