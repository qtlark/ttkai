import chalk from 'chalk';
import User from '@fiora/database/mongoose/models/user';
import initMongoDB from '@fiora/database/mongoose/initMongoDB';

export async function getUserIp(username: string) {
    if (!username) {
        console.log(chalk.red('Wrong command, [username] is missing.'));
        return;
    }

    await initMongoDB();

    const user = await User.findOne({ username });
    if (!user) {
        console.log(chalk.red(`User [${username}] does not exist`));
    } else {
        console.log(
            `The userIp of [${username}] is:`,
            chalk.green(user.lastLoginIp.toString()),
        );
    }
}

async function run() {
    const username = process.argv[3];
    await getUserIp(username);
    process.exit(0);
}
export default run;
