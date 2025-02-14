import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import { promisify } from 'util';
import chalk from 'chalk';
import initMongoDB from '@fiora/database/mongoose/initMongoDB';
import Message from '@fiora/database/mongoose/models/message';
import History from '@fiora/database/mongoose/models/history';

export async function deleteXSC() {


    await initMongoDB();

    await Message.deleteMany({to:'6254afd404b67034641a6200'});

    await History.deleteMany({linkman:'6254afd404b67034641a6200'});

    console.log(chalk.green('Successfully deleted all messages'));
}

async function run() {
    await deleteXSC();
    process.exit(0);
}
export default run;
