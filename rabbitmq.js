import amqp from "amqplib";

let ch = null;
const BROKER_URL = process.env.BROKER_URL || 'amqp://localhost';

const connectRabbitMQ = async () => {
    if (ch) return ch; // Return existing channel if already connected

    try {
        const conn = await amqp.connect(BROKER_URL);
        ch = await conn?.createChannel();
        console.log("Successfully connected to RabbitMQ...")
    } catch (error) {
        console.log("Oops something went wrong during connection!")
        console.log(error);
    }

    let queue = "";
    const supportedLanguages = ["c", "c++"];

    supportedLanguages.forEach(async (language) => {
        queue = `${language}-code-queue`;
        await ch.assertQueue(queue, { durable: true });
    })

    return ch;
};

export { connectRabbitMQ };
