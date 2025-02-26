export function createIsUploadsPath(uploadsBase: string) {
  return (url: string) => {
    return url.startsWith(uploadsBase);
  };
}
