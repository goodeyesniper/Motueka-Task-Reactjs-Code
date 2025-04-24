export function getTimeDifference(lastSeen) {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInSeconds = Math.floor((now - lastSeenDate) / 1000);
  
    if (diffInSeconds < 60) return "Is active now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

export function getLastSeenStatus(lastSeen) {
const now = new Date();
const lastSeenDate = new Date(lastSeen);
const diffInSeconds = Math.floor((now - lastSeenDate) / 1000);

if (diffInSeconds < 60) {
    return { status: "Online", lastSeenText: "Active now", online: true };
}

if (diffInSeconds < 3600) {
    return { status: "Offline", lastSeenText: `Last seen: ${Math.floor(diffInSeconds / 60)} minutes ago`, online: false };
}

if (diffInSeconds < 86400) {
    return { status: "Offline", lastSeenText: `Last seen: ${Math.floor(diffInSeconds / 3600)} hours ago`, online: false };
}

return { status: "Offline", lastSeenText: `Last seen: ${Math.floor(diffInSeconds / 86400)} days ago`, online: false };
}
  