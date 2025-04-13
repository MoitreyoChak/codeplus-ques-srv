import { connect, StringCodec } from 'nats';

let nc = null;
let js = null;
let sc = StringCodec();

export const initJetStream = async () => {
    if (!nc) {
        nc = await connect({ servers: "localhost:4222" }); // Or from env var
        js = nc.jetstream();
        console.log("✅ Connected to JetStream");
    }
};

export const getJetStreamClients = () => {
    return { nc, js, sc };
};
