import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

import { startSlaScheduler } from './jobs/slaScheduler.js';

connectDB()
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`Server is running at port : ${env.PORT}`);
            startSlaScheduler();
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
