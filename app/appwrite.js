import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67033f0700369e8affd5');

export const account = new Account(client);
export { ID } from 'appwrite';