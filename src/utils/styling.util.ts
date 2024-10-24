export const usernameToLink = (
  id: number,
  username: string = "User"
): string => {
  return `<a href="tg://user?id=${id}">${username}</a>`;
};
