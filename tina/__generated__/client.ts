import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'c0dae5149a6de428b239c63fd03821589f538a6c', queries,  });
export default client;
  