import BackgroundImage from '@fiora/assets/images/background.jpg';
import BackgroundCoolImage from '@fiora/assets/images/background-cool.jpg';
import BackgroundDarkImage from '@fiora/assets/images/background-dark.jpg';

type Themes = {
    [theme: string]: {
        primaryColor: string;
        primaryTextColor: string;
        anataColor: string;
        anataTextColor: string;
        backgroundImage: string;
        aero: boolean;
    };
};

const themes: Themes = {
    default: {
        primaryColor: '74, 144, 226',
        primaryTextColor: '247, 247, 247',
        anataColor: '246, 247, 245',
        anataTextColor: '51, 51, 51',
        backgroundImage: BackgroundImage,
        aero: false,
    },
    cool: {
        primaryColor: '5,159,149',
        primaryTextColor: '255, 255, 255',
        anataColor: '246, 247, 245',
        anataTextColor: '51, 51, 51',
        backgroundImage: BackgroundCoolImage,
        aero: false,
    },
    dark: {
        primaryColor: '0,0,0',
        primaryTextColor: '255, 255, 255',
        anataColor: '0, 0, 0',
        anataTextColor: '246, 247, 245',
        backgroundImage: BackgroundDarkImage,
        aero: false,
    },
};

export default themes;
