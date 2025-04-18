import { connect, StringCodec } from 'nats';

let nc = null;
let js = null;
let sc = StringCodec();

const NATS_URL = process.env.NATS_URL || "nats://localhost:4222";

export const initJetStream = async () => {
    if (!nc) {
        nc = await connect({ servers: NATS_URL }); // Or from env var
        js = nc.jetstream();
        console.log("✅ Connected to JetStream");
    }
};

export const getJetStreamClients = () => {
    return { nc, js, sc };
};
