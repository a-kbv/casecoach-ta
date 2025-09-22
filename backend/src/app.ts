import express from 'express';
import technologyRoutes from './routes/technologies';
import { TechnologyModel } from './models/technology';

const app = express();
const PORT = 3000;

//load data
TechnologyModel.loadData();

//middleware for json and body parsing
app.use(express.json());
app.use(express.urlencoded(
    { extended: true }
));

//CORS
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routing
app.use('/api/technologies', technologyRoutes);

//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
0