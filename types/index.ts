export interface Message {
  id: number;
  text: string;
  sender: string;
  recever : string,
  time: string;
}

export interface Contact {
  name?: string;
  id?: string;
  color?: string;
  status?: string
}

