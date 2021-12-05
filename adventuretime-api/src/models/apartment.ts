import { room } from "./room"

export interface apartment {
  name: string;
  description: string;
  room: Array<room>;
}