import mongoose from 'mongoose';

import { DB_URL } from './config';

export default () => mongoose.connect(DB_URL, { useNewUrlParser: true });
