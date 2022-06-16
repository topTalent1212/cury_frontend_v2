export type BasketballItemType = {
    id: number;
    title: string;
    traits: Array<any>;
};

export type SerumItemType = {
    id: number;
    title: string;
    desc: string;
};

export type MutantItemType = {
    id: number;
    title: string;
    desc: string;
};

export type GCFTokenInfoType = {
    title: string;
    image: string;
    count: number;
    tokenId: number;
};

export type MetaverseShoesTokenInfoType = {
    title: string;
    platform: string;
    image: string;
    count: number;
};

export type WearableItemType = {
    id: number;
    type: number;
    url: string;
    title: string;
    desc: string;
};

export type RaffleWinnerItemType = {
    _id: string;
    game_id: number;
    claimed: boolean;
    // name: string;
    // url: string;
    createdAt: string;
    updatedAt: string;
    wallet: string;
};

export type SelectItemType = {
    label: string;
    value: string;
    icon?: React.ReactNode;
};
