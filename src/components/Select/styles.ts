import { styled, Box, Stack, Button } from '@mui/material';

export const ListItemsWrapper = styled(Box)<{ isOpen: number }>`
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    padding-top: 4px;
    z-index: 10;
`;

export const ListItemsStack = styled(Stack)`
    border-radius: 4px;
    padding: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0px 4px 40px -26px rgba(0, 20, 39, 0.8);
`;

export const ItemButton = styled(Button)<{ selected: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 12px;
    background: ${({ selected }) => (selected ? '#e8f4ff' : 'transparent')};
    color: #0a0b0c;
    &:hover {
        background: #e8f4ff;
    }
`;
