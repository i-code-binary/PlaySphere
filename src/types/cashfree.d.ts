declare module "@cashfreepayments/cashfree-js" {
  interface LoadOptions {
    mode: "sandbox" | "production";
  }

  /**
   * Loads the Cashfree JS SDK with the specified options.
   * @param options Configuration options for the SDK, including mode.
   * @returns A promise that resolves when the SDK is loaded.
   */
  const load: (options: LoadOptions) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  export { load };
}

