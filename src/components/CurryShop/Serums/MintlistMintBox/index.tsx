import React, { useState } from 'react';
import { Stack, Box, Typography, Dialog, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import web3 from 'web3';
import BasketballHeadABI from '../../../../lib/ABI/BasketBallHead.json';
import { MintBtn } from './styles';
import CompleteIcon from '@mui/icons-material/CheckCircleOutline';
import { confirmClaimSerumCommunity } from '../../../../services/fetch';
import { useAppContext } from '../../../../context/AppContext';
import { SelectItemType } from '../../../../types';
import SerumTypeSelect from '../../SerumTypeSelect';

type ComponentProps = {
    // amountLeft: number;
    communityOwnedCount: number;
    communityClaimHexProof: any[];
    setNeedUpdateInfo: (value: boolean) => void;
};

enum MintStatus {
    NOT_MINTED,
    MINTING,
    MINT_FAILED,
    MINT_SUCCESS,
}

export const serumTypeOptions: Array<SelectItemType> = [
    {
        label: 'Unanimous1',
        value: 'Unanimous1',
        icon: <img src="/assets/curryshop/serumtypes/unanimous.png" width={24} height={24} />,
    },
    {
        label: 'Unanimous2',
        value: 'Unanimous2',
        icon: <img src="/assets/curryshop/serumtypes/unanimous.png" width={24} height={24} />,
    },
    {
        label: 'Unanimous3',
        value: 'Unanimous3',
        icon: <img src="/assets/curryshop/serumtypes/unanimous.png" width={24} height={24} />,
    },
    {
        label: 'Unanimous4',
        value: 'Unanimous4',
        icon: <img src="/assets/curryshop/serumtypes/unanimous.png" width={24} height={24} />,
    },
    {
        label: 'Unanimous5',
        value: 'Unanimous5',
        icon: <img src="/assets/curryshop/serumtypes/unanimous.png" width={24} height={24} />,
    },
];

const SerumMintlistMintBox: React.FC<ComponentProps> = ({
    communityOwnedCount,
    communityClaimHexProof,
    setNeedUpdateInfo,
}): JSX.Element => {
    const { account, library } = useWeb3React();
    const [appState, setAppState] = useAppContext();

    const [mintState, setMintState] = useState<MintStatus>(MintStatus.NOT_MINTED);
    const [claimedCount, setclaimedCount] = useState<number>(0);

    const [serumType, setSerumType] = useState<SelectItemType>(serumTypeOptions[0]);

    const mint = async () => {
        if (!account) return;

        setMintState(MintStatus.MINTING);

        const nftContract = new library.eth.Contract(
            BasketballHeadABI,
            process.env.NEXT_PUBLIC_ENV == 'production'
                ? '0x75615677d9cd50cb5D9660Ffb84eCd4d333E0B76'
                : '0xdb52bBC7bc3312B815E2978Aed339987D95D0444'
        );

        let _mintPrice = 0.07;
        let value = (_mintPrice * communityOwnedCount).toString();
        value = web3.utils.toWei(value, 'ether');
        await nftContract.methods
            .mint(communityOwnedCount, communityClaimHexProof)
            .send({ from: account, value: value })
            .then(
                //to do : update db
                () => {
                    setclaimedCount(communityOwnedCount);
                    setMintState(MintStatus.MINT_SUCCESS);
                    setNeedUpdateInfo(true);

                    confirmClaimSerumCommunity(account, appState.jwtToken)
                        .then((response: any) => {
                            // console.log('resonse:', response);
                        })
                        .catch((error) => {
                            // console.log(error);
                        });
                }
            )
            .catch((e: any) => {
                setMintState(MintStatus.MINT_FAILED);
                // console.log(e);
            });
    };

    return (
        <>
            <Stack borderRadius={2} sx={{ background: '#1B1C22' }}>
                <Box
                    position="relative"
                    width="100%"
                    height={{ xs: 160, md: 220 }}
                    overflow="hidden"
                    sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                >
                    <Image src={'/assets/curryshop/serum-mintlist-mint-banner.png'} layout="fill" objectFit="cover" />
                </Box>
                <Stack spacing={3} padding={{ xs: 2, md: 4 }}>
                    <Typography
                        fontSize={48}
                        fontWeight={800}
                        lineHeight={1.1}
                        textTransform="uppercase"
                        className="neueplak_condensed"
                    >
                        SERUM MINTLIST MINT
                    </Typography>
                    <Typography fontWeight={700}>
                        Mintlist spots will also be given to all community supporters.
                    </Typography>
                    <Stack>
                        <Typography>° FTX 2974 Holders: Enter your code here to qualify for the Mintlist.</Typography>
                        <Typography>
                            ° GCF Metaverse Shoe Holders: The mintlist snapshot will be taken on DATE-TIME.
                        </Typography>
                        <Typography>° NFT Community: Mintlist spot winners will be able to claim here.</Typography>
                    </Stack>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        spacing={4}
                        marginTop={3}
                    >
                        <Box minWidth={240} width={240} height={240} position="relative">
                            <Image src={'/assets/curryshop/serum-box.png'} layout="fill" style={{ borderRadius: 16 }} />
                        </Box>
                        <Stack>
                            <Typography fontSize={20} fontWeight={700}>
                                Serums
                            </Typography>
                            <Typography fontSize={32} fontWeight={700} marginTop={2}>
                                PRICE: 0.03 ETH{' '}
                                <Typography fontWeight={700} display="inline">
                                    (+GAS FEE)
                                </Typography>
                            </Typography>
                            <Stack spacing={1} marginTop={3}>
                                <Typography fontSize={14}>Serum Type</Typography>
                                <SerumTypeSelect
                                    serumType={serumType}
                                    setSerumType={setSerumType}
                                    serumTypeOptions={serumTypeOptions}
                                />
                            </Stack>
                            <Stack marginTop={2}>
                                <Typography fontWeight={700}>{`You have ${
                                    mintState === MintStatus.MINT_SUCCESS ? 0 : communityOwnedCount
                                } Mintlist Spots`}</Typography>
                                <MintBtn
                                    sx={{ marginTop: 1 }}
                                    disabled={mintState === MintStatus.MINT_SUCCESS || !communityOwnedCount}
                                    onClick={mint}
                                >
                                    MINT
                                </MintBtn>
                            </Stack>
                        </Stack>
                    </Stack>
                    {mintState === MintStatus.MINT_SUCCESS && (
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            padding={2}
                            borderRadius={1}
                            marginTop={3}
                            sx={{ background: '#FFFFFFE5' }}
                        >
                            <CompleteIcon sx={{ color: '#4CAF50' }} />
                            <Typography fontSize={14} fontWeight={500} color="#1E4620">
                                {`You have claimed ${claimedCount} NF3 Basketball, please check your `}
                                <a href="https://opensea.io/" target="_blank" style={{ color: '#2986F2' }}>
                                    Opensea
                                </a>{' '}
                                profile to check if the NF3 Basketball is in your wallet
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </Stack>
            <Dialog
                open={mintState === MintStatus.MINTING}
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        padding: 4,
                        background: 'none',
                    },
                }}
            >
                <CircularProgress />
            </Dialog>
        </>
    );
};

export default SerumMintlistMintBox;
