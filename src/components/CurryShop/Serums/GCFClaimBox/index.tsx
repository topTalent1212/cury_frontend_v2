import React, { useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import web3 from 'web3';
import { Stack, Box, Grid, Typography, Dialog, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { MintBtn } from './styles';
import SerumABI from '../../../../lib/ABI/Serum.json';
import CompleteIcon from '@mui/icons-material/CheckCircleOutline';
// import { confirmClaimSerumGCF } from '../../../../services/api/curryshop';
import { useAppContext } from '../../../../context/AppContext';
import { SelectItemType } from '../../../../types';
import SerumTypeSelect from '../../SerumTypeSelect';
import serumTokensList from '../../../../constants/serumTokenData';

type ComponentProps = {
    mintData: any;
    setNeedUpdateInfo: (value: boolean) => void;
};

enum MintStatus {
    NOT_MINTED,
    MINTING,
    MINT_FAILED,
    MINT_SUCCESS,
}

const SerumGCFClaimBox: React.FC<ComponentProps> = ({ mintData, setNeedUpdateInfo }): JSX.Element => {
    const { account, library } = useWeb3React();
    const [appState, setAppState] = useAppContext();

    const [gcfOwnedCount, setGcfOwnedCount] = useState<number>(0);
    const [gcfClaimHexProof, setGcfClaimHexProof] = useState<any[]>([]);

    const [mintState, setMintState] = useState<MintStatus>(MintStatus.NOT_MINTED);
    const [claimedCount, setclaimedCount] = useState<number>(0);

    const [serumTypeOptions, setSerumTypeOptions] = useState<Array<SelectItemType>>([]);
    const [serumType, setSerumType] = useState<SelectItemType>();

    React.useEffect(() => {
        async function updateSerumTokenList() {
            const nftContract = new library.eth.Contract(
                SerumABI,
                process.env.NEXT_PUBLIC_ENV == 'production' ? '' : '0x0ec788eA9C07dB16374B4bddd4Fd586a8844B4dE'
            );

            let serumOptions: Array<SelectItemType> = [];

            for (let id in mintData) {
                let minted = await nftContract.methods.mintedForGCF(account, id).call({ from: account });
                if (!minted) {
                    serumOptions = [...serumOptions, serumTokensList[id]];
                }
            }

            setSerumTypeOptions(serumOptions);

            if (serumOptions.length > 0) setSerumType(serumOptions[0]);
        }
        if (!!mintData) {
            // console.log('mintData keys:', Object.keys(mintData));
            updateSerumTokenList();
        }
    }, [mintData]);

    React.useEffect(() => {
        if (!!serumType) {
            // console.log('serumType:', serumType);

            setGcfOwnedCount(mintData[serumType.value].quantity);
            setGcfClaimHexProof(mintData[serumType.value].hexProof);
        }
    }, [serumType]);

    const mint = async () => {
        if (!account) return;

        setMintState(MintStatus.MINTING);

        const nftContract = new library.eth.Contract(
            SerumABI,
            process.env.NEXT_PUBLIC_ENV == 'production' ? '' : '0x0ec788eA9C07dB16374B4bddd4Fd586a8844B4dE'
        );

        nftContract.methods
            .claimForGCFHolders(serumType?.value, gcfOwnedCount, gcfClaimHexProof)
            .send({ from: account, value: 0 })
            .then(
                //to do : update db
                () => {
                    setclaimedCount(gcfOwnedCount);
                    setMintState(MintStatus.MINT_SUCCESS);
                    setNeedUpdateInfo(true);

                    setTimeout(() => setMintState(MintStatus.NOT_MINTED), 2000);

                    // confirmClaimSerumGCF(account, appState.jwtToken)
                    //     .then((response: any) => {
                    //         // console.log('resonse:', response);
                    //     })
                    //     .catch((error) => {
                    //         // console.log(error);
                    //     });
                }
            )
            .catch((e: any) => {
                setMintState(MintStatus.MINT_FAILED);
                // console.log(e);
            });
    };

    return (
        <>
            <Stack spacing={4} padding={{ xs: 2, md: 4 }} borderRadius={2} sx={{ background: '#1B1C22' }}>
                <Grid container columns={8} columnSpacing={4} rowGap={2}>
                    <Grid item xs={8} md={3}>
                        <img src="/assets/curryshop/serum-box.png" width="100%" style={{ borderRadius: 16 }} />
                    </Grid>
                    <Grid item xs={8} md={5}>
                        <Stack spacing={3}>
                            <Typography
                                fontSize={48}
                                fontWeight={800}
                                lineHeight={1.1}
                                textTransform="uppercase"
                                className="neueplak_condensed"
                            >
                                GCF SERUMS
                            </Typography>
                            <Typography color="#969AA1">
                                Our loyal Genesis Curry Flow holders are eligible to claim one free Serum. The Serum you
                                receive will be based on the rarity of your OG shoe. Happy Claiming!
                            </Typography>
                            <Typography fontSize={32} fontWeight={700}>
                                PRICE: FREE{' '}
                                <Typography fontWeight={700} display="inline">
                                    (+GAS FEE)
                                </Typography>
                            </Typography>
                            <Stack spacing={1}>
                                <Typography fontSize={14}>Serum Type</Typography>
                                <SerumTypeSelect
                                    serumType={serumType}
                                    setSerumType={setSerumType}
                                    serumTypeOptions={serumTypeOptions}
                                />
                            </Stack>
                            <Stack>
                                <Typography fontWeight={700}>{`You have ${
                                    mintState === MintStatus.MINT_SUCCESS ? 0 : gcfOwnedCount
                                } Genesis Curry Flow claims`}</Typography>
                                <MintBtn
                                    sx={{ marginTop: 1 }}
                                    disabled={mintState === MintStatus.MINT_SUCCESS || !gcfOwnedCount}
                                    onClick={mint}
                                >
                                    CLAIM
                                </MintBtn>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
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
                            {`You have claimed ${claimedCount} Serums, please check your `}
                            <a href="https://opensea.io/" target="_blank" style={{ color: '#2986F2' }}>
                                Opensea
                            </a>{' '}
                            profile to check if the Serums is in your wallet
                        </Typography>
                    </Stack>
                )}
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

export default SerumGCFClaimBox;
