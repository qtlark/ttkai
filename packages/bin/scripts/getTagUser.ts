import chalk from 'chalk';
import User from '@fiora/database/mongoose/models/user';
import initMongoDB from '@fiora/database/mongoose/initMongoDB';

export async function getTagUser() {
    await initMongoDB();

    const user = await User.find({ tag: {$ne:''} });
    if (!user) {
        console.log('No tag');
    } else {
        console.log(
            chalk.green(user.toString())
        );
    }
}

async function run() {
    await getTagUser();
    process.exit(0);
}
export default run;
