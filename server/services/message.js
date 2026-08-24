const messages = require("../data/messages.js");

const getMessages = (service) => {
    if (!messages[service]) {
        console.log("Service not available.");
        return;
    }

    console.log(`Messages from ${service}:`);
    console.log(messages[service]);

    return messages[service];
};

module.exports = { getMessages };