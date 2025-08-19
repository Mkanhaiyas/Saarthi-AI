// Formats a date into a readable string: "HH:MM AM/PM Mon DD YYYY"
export const formatDate = (date) => {
  const formatedDate = new Date(date);
  const now = new Date();
  const diffMs = now - formatedDate;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    // show only time
    return formatedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return formatedDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
};

// Capitalizes the first letter of a title string
export const formatedTitle = (title) => {
  return title.slice(0, 1).toUpperCase() + title.slice(1);
};

// Extracts chat title from a string like 'Title: "Something"'
export const extractChatTitle = (response) => {
  return response?.split(":")[1]?.trim();
};
