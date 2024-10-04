import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const { DefaultAzureCredential } = require("@azure/identity");
const axios = require("axios");

const credential = new DefaultAzureCredential();

async function callApiManagement() {
    // Acquire token for API Management
    const tokenResponse = await credential.getToken("https://management.azure.com/.default");

    // Make HTTP call to the API Management endpoint
    const response = await axios.get("https://api-management-spicedelightappapi.azure-api.net/spicedelightappapi/api/Product", {
        headers: {
            Authorization: `Bearer ${tokenResponse.token}`
        }
    });

    console.log(response.data);
}

export async function server(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';
    callApiManagement()

    return { body: `Hello, ${name}!` };
};

app.http('server', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: server
});
