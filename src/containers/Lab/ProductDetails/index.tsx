import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Container from '../../Container';
import { ImageBox } from './styles';
import BasketballImg from '../../../assets/items/basketball.png';
import SerumImg from '../../../assets/items/serum.png';
import MutantImg from '../../../assets/items/mutant.png';
import UserIcon from '../../../assets/thelabs/user.svg';
import TotalCountIcon from '../../../assets/thelabs/totalcount.svg';
import { useAppContext } from '../../../context/AppContext';

export enum Categories {
    NONE = -1,
    MUTANTS,
    BASKETBALLS,
    SERUMS,
    WEARABLES,
}

const categoryInfoList = [
    { img: MutantImg, title: 'Mutant' },
    { img: BasketballImg, title: 'Basketball' },
    { img: SerumImg, title: 'Serum' },
];

type ComponentProps = {
    id: number;
};

const ProductDetails: React.FC<ComponentProps> = ({ id }): JSX.Element => {
    const [appState, setAppState] = useAppContext();

    const getProductInfo = () => {
        let index = -1;

        index = appState.mutantsList.findIndex((item) => item.id === id);
        if (index !== -1) return { type: Categories.MUTANTS, title: appState.mutantsList[index].title };

        index = appState.basketballsList.findIndex((item) => item.id === id);
        if (index !== -1) return { type: Categories.BASKETBALLS, title: appState.basketballsList[index].title };

        index = appState.serumsList.findIndex((item) => item.id === id);
        if (index !== -1) return { type: Categories.SERUMS, title: appState.serumsList[index].title };

        return { type: Categories.NONE, title: '' };
    };

    let categoryInfo = getProductInfo();

    return (
        <Container sx={{ paddingY: 8 }}>
            <Stack direction="row" justifyContent="center" spacing={6}>
                <ImageBox>
                    <Image
                        src={categoryInfoList[categoryInfo.type].img}
                        width={400}
                        height={400}
                        alt=""
                        className="img"
                    />
                </ImageBox>
                <Stack>
                    <Typography fontSize={16} fontWeight={600} color="white">
                        Curry Brand
                    </Typography>
                    <Typography fontSize={48} fontWeight={700} color="white" marginTop={1}>
                        {categoryInfo.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={3.5} marginTop={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <UserIcon />
                            <Typography fontSize={16} fontWeight={400} color="#979797">
                                You own 3
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TotalCountIcon />
                            <Typography fontSize={16} fontWeight={400} color="#979797">
                                10,000 Total
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack borderRadius={2} spacing={4} padding={4} marginTop={3} sx={{ background: '#1B1C22' }}>
                        <Typography fontSize={32} fontWeight={700} color="white">
                            Properties
                        </Typography>
                        <Stack
                            width="fit-content"
                            alignItems="center"
                            borderRadius={2}
                            spacing={0.5}
                            padding={2}
                            sx={{ background: '#FFCA211A' }}
                        >
                            <Typography fontSize={12} fontWeight={400} color="#FFCA21">
                                Type
                            </Typography>
                            <Typography fontSize={16} fontWeight={600} color="white">
                                {categoryInfoList[categoryInfo.type].title}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
};

export default ProductDetails;