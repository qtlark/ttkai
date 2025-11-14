import BackgroundImage from '@fiora/assets/images/background.jpg';
import BackgroundCoolImage from '@fiora/assets/images/background-cool.jpg';
import BackgroundDarkImage from '@fiora/assets/images/background-dark.jpg';

type Themes = {
    [theme: string]: {
        primaryColor: string;
        primaryTextColor: string;
        backgroundImage: string;
        aero: boolean;
    };
};

const themes: Themes = {
    default: {
        primaryColor: '74, 144, 226',
        primaryTextColor: '247, 247, 247',
        backgroundImage: BackgroundImage,
        aero: false,
    },
    cool: {
        primaryColor: '5,159,149',
        primaryTextColor: '255, 255, 255',
        backgroundImage: BackgroundCoolImage,
        aero: false,
    },
    dark: {
        primaryColor: '0,0,0',
        primaryTextColor: '255, 255, 255',
        backgroundImage: BackgroundDarkImage,
        aero: false,
    },
};

export default themes;
