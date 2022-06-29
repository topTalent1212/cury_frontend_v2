import { styled, Button } from '@mui/material';

export const CancelBtn = styled(Button)`
    width: 156px;
    height: 34px;
    border: 1px solid #ffca21;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #ffca21;
    padding-top: 1px;
`;

export const FuseBtn = styled(Button)`
    width: 156px;
    height: 34px;
    border: 1px solid #ffca21;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #ffca21;
    padding-top: 1px;
    &:disabled {
        background: #969aa1;
        border-color: transparent;
        color: #202230;
    }
`;
