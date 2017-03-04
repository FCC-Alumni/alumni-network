import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.listen(8080, () => console.log('Server is running on localhost:8080'));