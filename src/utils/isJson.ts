export function isJsonString(str: unknown) {
  try {
    if (typeof str !== "string")
      throw new Error("Provided value is not a string");

    const o = JSON.parse(str);

    if (o && typeof o === "object") {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}
