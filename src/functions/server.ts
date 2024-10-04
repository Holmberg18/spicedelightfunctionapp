import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { DefaultAzureCredential} from "@azure/identity"
import axios from "axios"


export async function callApiManagement(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("api://b456166d-fe5c-43bd-a65f-de5be868f821");
    
    const token = tokenResponse.token;

    const response = await axios.get("https://api-management-spicedelightappapi.azure-api.net/spicedelightappapi/api/Product", {
        headers: {
           Authorization: `Bearer ${token}`
        }
     });

     return { body: JSON.stringify(response) };

}
export async function server(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('server', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: server
});

app.http('product', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: callApiManagement
});
