import { makeAutoObservable } from "mobx";

class ChatStore {
  messages = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  addMessage(message) {
    this.messages.push(message);
  }

  setLoading(status) {
    this.loading = status;
  }

  clearMessages() {
    this.messages = [];
  }
}

export const chatStore = new ChatStore();
